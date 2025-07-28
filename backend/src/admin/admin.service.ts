import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from '../resume/resume.entity';
import { ResumeAnalysis } from '../resume/resume-analysis.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepo: Repository<Resume>,
    @InjectRepository(ResumeAnalysis)
    private readonly analysisRepo: Repository<ResumeAnalysis>,
  ) {}

  async getAllResumesWithScores() {
    // Join resumes with their analysis (score)
    return this.resumeRepo.find({
      relations: [],
      // Optionally, join with analysis or fetch separately
    });
  }

  async getAllAIAnalysis() {
    return this.analysisRepo.find();
  }
}
