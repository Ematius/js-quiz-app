import {IsInt, IsNotEmpty} from 'class-validator';


export class ToggleQuestionDto {
  @IsInt()
  @IsNotEmpty()
  questionId: number;
}