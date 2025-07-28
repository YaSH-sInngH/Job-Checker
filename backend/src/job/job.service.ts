import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Job } from './job.entity';
import axios from 'axios';
import { ChromaClient } from 'chromadb';

interface JobMetadata {
  jobId: number;
  title: string;
}

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async seedJobs(jobs: Array<{ title: string; description: string; skills?: string; company?: string}>): Promise<Job[]> {
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
    const createdJobs: Job[] = [];
    for (const job of jobs) {
      // 1. Get embedding from Cohere
      const cohereApiKey = process.env.COHERE_API_KEY;
      const cohereEmbedUrl = 'https://api.cohere.ai/v1/embed';
      const embeddingResp = await axios.post(
        cohereEmbedUrl,
        {
          texts: [job.description],
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

      // 2. Store job in DB
      const jobEntity = this.jobRepo.create({
        title: job.title,
        description: job.description,
        skills: job.skills,
        company: job.company
      });
      const savedJob = await this.jobRepo.save(jobEntity);
      createdJobs.push(savedJob);

      // 3. Store embedding in ChromaDB
      await collection.add({
        ids: [String(savedJob.id)],
        embeddings: [embedding],
        metadatas: [{ jobId: savedJob.id, title: job.title }],
        documents: [job.description],
      });
    }
    return createdJobs;
  }

  async searchJobs(queryEmbedding: number[], topK = 5): Promise<Job[]> {
    const chroma = new ChromaClient({ path: 'http://localhost:8000' });
    const collection = await chroma.getOrCreateCollection({ name: 'jobs' });
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK,
      include: ['metadatas'],
    });
    const jobIds = (results.metadatas[0] ?? [])
      .filter((meta): meta is { jobId: number } =>
        !!meta && typeof meta === 'object' && 'jobId' in meta && typeof (meta as any).jobId === 'number'
      )
      .map((meta) => meta.jobId);
    if (!jobIds.length) return [];
    return this.jobRepo.find({ where: { id: In(jobIds) } });
  }
}
