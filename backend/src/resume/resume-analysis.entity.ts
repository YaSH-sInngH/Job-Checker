import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class ResumeAnalysis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resumeId: number;

  @ManyToOne(() => Resume)
  resume: Resume;

  @Column({ type: 'text' })
  skills: string;

  @Column({ type: 'text' })
  suggestions: string;

  @Column('int')
  score: number;

  @CreateDateColumn()
  createdAt: Date;
} 