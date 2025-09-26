type Level = 'junior' | 'senior' | 'guru';
type MethodType = 'array' | 'string';
type ModeAnswer = 'teorica' | 'practica';

export interface QuestionDto {
  id: number;
  question: string;
  answer: string;
  level: Level;
  method: string;
  method_type: MethodType;
  mode_answer: ModeAnswer;
  explanation: string | null;
}

export interface AnswerDto {
  questionId: number;
  answer: string;
}

export interface AnswerResultInviteDto {
  isCorrect: boolean;
  correctAnswer: string;
}
