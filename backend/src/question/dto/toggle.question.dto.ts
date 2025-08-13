import {IsInt, IsNotEmpty} from 'class-validator';


export class ToggleQuestionDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  questionId: number;
}