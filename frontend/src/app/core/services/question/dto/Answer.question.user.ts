export interface AnswerUserDto {
  questionId: number;
  answer: string;
}

export interface AnswerResponseDto {
  isCorrect: boolean;
  questionId: number;
  correctAnswer: string;
}


