import {IsInt, IsString} from 'class-validator';

export class AnswerQuestionDto {
  
  @IsInt()
  questionId: number;

  @IsString()
  answer: string;

  @IsInt()
  userId: number;
}