import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { ResumeService } from '../resume/resume.service';
import axios from 'axios';

@Controller('jobs')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly resumeService: ResumeService,
  ) {}

  @Post('seed')
  async seed(@Body() body: { jobs: Array<{ title: string; description: string }> }) {
    return this.jobService.seedJobs(body.jobs);
  }

  @Get('search')
  async search(@Query('resumeId') resumeId: string) {
    // Get resume embedding from DB
    const resume = await this.resumeService.getResumeWithAnalysis(Number(resumeId));
    if (!resume || !resume.resume) return [];
    // Get embedding from ChromaDB (or from DB if stored)
    // For open-source, we assume embedding is not stored, so re-embed
    const embeddingResp = await axios.post('http://localhost:8001/embed', { text: resume.resume.text });
    const embedding = embeddingResp.data.embedding;
    return this.jobService.searchJobs(embedding);
  }
}
