import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn()
  createdAt: Date;
} 