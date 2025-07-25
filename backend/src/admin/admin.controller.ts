import { Controller, Get, UseGuards } from '@nestjs/common';
import { ResumeService } from '../resume/resume.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../user/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get('resumes')
  @Roles(UserRole.ADMIN)
  async getAllResumes() {
    return this.resumeService.getAllResumesWithAnalysis();
  }
}
