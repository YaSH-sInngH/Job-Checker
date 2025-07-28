import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { NotFoundException, BadRequestException } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<Omit<User, 'password'>> {
    const existing = await this.userService.findByEmail(signupDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const existingUsername = await this.userService.findByUsername(signupDto.username);
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }
    const hashed = await bcrypt.hash(signupDto.password, 10);
    const user = await this.userService.create({
      email: signupDto.email,
      username: signupDto.username,
      password: hashed,
      role: signupDto.role || UserRole.USER,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getMe(userId: number): Promise<Omit<User, 'password'> | undefined> {
    const user = await this.userService.findById(userId);
    if (!user) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await this.userService.save(user);

    // Send email (configure transporter for your provider)
    const transporter = nodemailer.createTransport({
      // Use your SMTP config or a service like SendGrid/Mailgun
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      text: `Reset your password: ${resetUrl}`,
    });
    return { message: 'Reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userService.findByResetToken(token);
    if (!user || user.resetPasswordExpires < Date.now()) {
      throw new BadRequestException('Invalid or expired token');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = '';
    user.resetPasswordExpires = 0;
    await this.userService.save(user);
    return { message: 'Password reset successful' };
  }
}
