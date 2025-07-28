import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  skills: string; // comma-separated or JSON array

  @Column({ nullable: true })
  company: string;

  @CreateDateColumn()
  createdAt: Date;
} 