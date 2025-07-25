import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './resume.entity';
import { ResumeAnalysis } from './resume-analysis.entity';
import { Job } from '../job/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume, ResumeAnalysis, Job]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
