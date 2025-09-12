import { Component, inject, OnInit } from '@angular/core';
import { QuestionService } from '../../core/services/question.service';
import {
  AnswerResultInviteDto,
  QuestionDto,
  AnswerInviteDto,
} from '../../core/services/dto/dto.question';
import { Observable } from 'rxjs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly questionService = inject(QuestionService);

  currentId = 1;
  question: QuestionDto | null = null;
  errorMsg: string | null = null;

  result: AnswerResultInviteDto | null = null;

  userAnswer: string = '';

  ngOnInit() {
    this.loadQuestion();
  }

  loadQuestion(): void {
    this.questionService.getOneQuestion(this.currentId).subscribe({
      next: (question) => {
        this.question = question;
        this.errorMsg = null;
      },
      error: () => {
        this.question = null;
        this.errorMsg = 'No hay más preguntas disponibles';
      },
    });
  }
  afterQuestion(): void {
    if (this.currentId > 1) {
      this.currentId--;
      this.result = null;
      this.loadQuestion();
    }
  }

  nextQuestion(): void {
    this.currentId++;
    this.result = null;
    this.loadQuestion();
  }
  restart(): void {
    this.currentId = 1;
    this.loadQuestion();
  }

  answerInvite(dto: AnswerInviteDto) {
    this.questionService.postAnswerInvite(dto).subscribe({
      next: (res) => {
        this.result = res;
        this.errorMsg = null;
      },
      error: (err) => {
        this.result = null;
        this.errorMsg = 'Error al enviar la respuesta';
      },
    });
  }

  sendAnswer(): void {
    if (!this.question) return;

    const dto: AnswerInviteDto = {
      questionId: this.question.id,
      answer: this.userAnswer,
    };
    this.answerInvite(dto);
    this.userAnswer = '';
  }
}
