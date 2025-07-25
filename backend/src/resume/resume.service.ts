import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from './resume.entity';
import { Job } from '../job/job.entity';
import { ResumeAnalysis } from './resume-analysis.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
// import * as docx from 'docx'; // Placeholder for DOCX parsing
import axios from 'axios';
import { ChromaClient } from 'chromadb';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepo: Repository<Resume>,
    @InjectRepository(ResumeAnalysis)
    private readonly analysisRepo: Repository<ResumeAnalysis>,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async uploadResume(userId: number, file: Express.Multer.File): Promise<Resume> {
    let text = '';
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf') {
      const data = await pdfParse(fs.readFileSync(file.path));
      text = data.text;
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: file.path });
      text = result.value;
    } else {
      throw new Error('Unsupported file type');
    }
    const resume = this.resumeRepo.create({
      userId,
      filename: file.filename,
      originalname: file.originalname,
      text,
    });
    return this.resumeRepo.save(resume);
  }

  async analyzeResume(resume: Resume): Promise<ResumeAnalysis> {
    // 1. Call Cohere for skills, suggestions, score
    const cohereApiKey = process.env.COHERE_API_KEY;
    const cohereGenerateUrl = 'https://api.cohere.ai/v1/generate';
    const prompt = `Extract the following from this resume text:\n1. List of skills\n2. Suggestions for improvement\n3. Score the resume from 0 to 100\nResume:\n${resume.text}`;
    const response = await axios.post(
      cohereGenerateUrl,
      {
        model: 'command-r-plus', // or another Cohere model
        prompt,
        max_tokens: 500,
        temperature: 0.2,
      },
      {
        headers: {
          'Authorization': `Bearer ${cohereApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const content = response.data.generations[0].text;
    console.log('AI Content:', content);
    // Simple parsing (customize as needed)
    const skillsMatch = content.match(/skills[:\s]*([\s\S]*?)suggestions[:\s]/i);
    const suggestionsMatch = content.match(/suggestions[:\s]*([\s\S]*?)score[:\s]/i);
    // Try to match "Score ...: 75/100" or "Score ...: 75"
    let score = 0;
    const scoreMatch = content.match(/score[^\d]*(\d{1,3})\s*\/\s*100/i) || content.match(/score[^\d]*(\d{1,3})/i);
    if (scoreMatch) {
      score = parseInt(scoreMatch[1], 10);
    }
    const skills = skillsMatch ? skillsMatch[1].trim() : '';
    const suggestions = suggestionsMatch ? suggestionsMatch[1].trim() : '';
    let scoreExplanation = '';
    const scoreExplanationMatch = content.match(/score[:\s]*.*?(?:\d{1,3}\/?100?)?[\.\n]*(.*)/i);
    if (scoreExplanationMatch) {
      scoreExplanation = scoreExplanationMatch[1].trim();
    }
    // 2. Get embedding from Cohere
    const cohereEmbedUrl = 'https://api.cohere.ai/v1/embed';
    const embeddingResp = await axios.post(
      cohereEmbedUrl,
      {
        texts: [resume.text],
        model: 'embed-english-v3.0',
        input_type: 'search_document', // <-- Add this line
      },
      {
        headers: {
          'Authorization': `Bearer ${cohereApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const embedding = embeddingResp.data.embeddings[0];

    // 3. Store embedding in ChromaDB
    const chroma = new ChromaClient();
    const identityEmbeddingFunction = {
      generate: async (_texts: string[]) => {
        throw new Error('Should not be called, as you provide embeddings directly.');
      },
      name: 'identity',
    };
    
    const collection = await chroma.getOrCreateCollection({
      name: 'resumes',
      embeddingFunction: identityEmbeddingFunction,
    });
    await collection.add({
      ids: [String(resume.id)],
      embeddings: [embedding],
      metadatas: [{ userId: resume.userId, resumeId: resume.id }],
      documents: [resume.text],
    });

    // 4. Store analysis in DB
    const analysis = this.analysisRepo.create({
      resumeId: resume.id,
      skills,
      suggestions,
      score,
    });
    return this.analysisRepo.save(analysis);
  }

  async getResumeWithAnalysis(id: number): Promise<{ resume: Resume; analysis: ResumeAnalysis | null }> {
    const resume = await this.resumeRepo.findOne({ where: { id } });
    if (!resume) throw new NotFoundException('Resume not found');
    const analysis = await this.analysisRepo.findOne({ where: { resumeId: id } });
    return { resume, analysis };
  }

  async getResumesByUser(userId: number): Promise<Array<{ resume: Resume; analysis: ResumeAnalysis | null }>> {
    const resumes = await this.resumeRepo.find({ where: { userId } });
    const results = await Promise.all(
      resumes.map(async (resume) => {
        const analysis = await this.analysisRepo.findOne({ where: { resumeId: resume.id } });
        return { resume, analysis };
      })
    );
    return results;
  }

  async getMatches(resumeId: number, topK = 5): Promise<any[]> {
    // 1. Get the resume
    const resume = await this.resumeRepo.findOne({ where: { id: resumeId } });
    if (!resume) throw new NotFoundException('Resume not found');

    // 2. Get embedding from Cohere (re-embed for safety)
    const cohereApiKey = process.env.COHERE_API_KEY;
    const cohereEmbedUrl = 'https://api.cohere.ai/v1/embed';
    const embeddingResp = await axios.post(
      cohereEmbedUrl,
      {
        texts: [resume.text],
        model: 'embed-english-v3.0',
        input_type: 'search_document',
      },
      {
        headers: {
          'Authorization': `Bearer ${cohereApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const embedding = embeddingResp.data.embeddings[0];

    // 3. Query ChromaDB for similar jobs
    const chroma = new ChromaClient();
    const identityEmbeddingFunction = {
      generate: async (_texts: string[]) => {
        throw new Error('Should not be called, as you provide embeddings directly.');
      },
      name: 'identity',
    };
    const collection = await chroma.getOrCreateCollection({
      name: 'jobs',
      embeddingFunction: identityEmbeddingFunction,
    });
    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
      include: ['metadatas'],
    });

    // 4. Get job IDs from metadata
    const jobIds = results.metadatas[0]?.map((meta: any) => meta.jobId) || [];
    if (!jobIds.length) return [];

    // 5. Fetch full job details from the database
    const jobs = await this.jobRepo.findByIds(jobIds);

    // 6. Optionally, sort jobs to match the order of jobIds
    const jobsMap = new Map(jobs.map(job => [job.id, job]));
    return jobIds.map(id => jobsMap.get(id)).filter(Boolean);
  }

  async getAllResumesWithAnalysis(): Promise<Array<{ resume: Resume; analysis: ResumeAnalysis | null }>> {
    const resumes = await this.resumeRepo.find();
    const results = await Promise.all(
      resumes.map(async (resume) => {
        const analysis = await this.analysisRepo.findOne({ where: { resumeId: resume.id } });
        return { resume, analysis };
      })
    );
    return results;
  }
}
