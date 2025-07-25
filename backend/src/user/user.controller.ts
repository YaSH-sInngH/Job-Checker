import { Controller, Get, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = parseInt(id, 10);
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.findById(userId);
  }
}
