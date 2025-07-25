import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResumeService } from './resume.service';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowed = ['.pdf', '.docx'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowed.includes(ext)) cb(null, true);
      else cb(new Error('Only PDF and DOCX files are allowed'), false);
    },
  }))
  async upload(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const resume = await this.resumeService.uploadResume(req.user.userId, file);
    const analysis = await this.resumeService.analyzeResume(resume);
    return { resume, analysis };
  }

  @Get()
  async getUserResumes(@Request() req) {
    return this.resumeService.getResumesByUser(req.user.userId);
  }

  @Get(':id')
  async getResume(@Param('id') id: string) {
    return this.resumeService.getResumeWithAnalysis(Number(id));
  }

  @Get(':id/matches')
  async getMatches(@Param('id') id: string) {
    return this.resumeService.getMatches(Number(id));
  }
}
