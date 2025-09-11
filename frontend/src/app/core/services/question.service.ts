import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type Level = 'junior' | 'senior' | 'guru';
type MethodType = 'array' | 'string';
type ModeAnswer = 'teorica' | 'practica';

export interface Question {
  id: number;
  question: string;
  answer: string;
  level: Level;
  method: string;
  method_type: MethodType;
  mode_answer: ModeAnswer;
  explanation: string | null;
}


export interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

}
