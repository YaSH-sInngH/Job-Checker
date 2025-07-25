import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ResumeModule } from './resume/resume.module';
import { JobModule } from './job/job.module';
import { CommonModule } from './common/common.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('SUPABASE_DB_URL'),
        autoLoadEntities: true,
        synchronize: true, // Set to false in production and use migrations!
      }),
    }),
    AuthModule,
    UserModule,
    ResumeModule,
    JobModule,
    CommonModule,
    AdminModule,
  ],
})
export class AppModule {}
