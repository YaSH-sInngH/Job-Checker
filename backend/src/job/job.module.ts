import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { ResumeModule } from '../resume/resume.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    ResumeModule,
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
