import { IsInt } from 'class-validator';
 
export class ResumeIdParamDto {
  @IsInt()
  id: number;
} 