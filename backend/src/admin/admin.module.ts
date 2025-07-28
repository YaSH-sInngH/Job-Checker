import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ResumeModule } from '../resume/resume.module';

@Module({
  imports: [ResumeModule],
  controllers: [AdminController],
})
export class AdminModule {}
