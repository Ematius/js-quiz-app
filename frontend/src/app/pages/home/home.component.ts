import { Component, inject, OnInit } from '@angular/core';
import { QuestionService } from '../../core/services/question/question.service';
import {
  AnswerResultInviteDto,
  QuestionDto,
  AnswerDto,
} from '../../core/services/question/dto/dto.question';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AnswerResponseDto,
  AnswerUserDto,
} from '../../core/services/question/dto/Answer.question.user';

import { ToggleFavoriteDto,ToggleFavoriteResponseDto } from '../../core/services/question/dto/toggle.question';
import { AuthService } from '../../core/services/auth/auth.service.service';
import { ResponseAnswerQuestion, ResponseProgressQuestion } from '../../core/services/question/dto/response.question.user';


@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly questionService = inject(QuestionService);
  private readonly AuthService = inject(AuthService);

  logIn = false || true;

  currentId = 1;

  question: QuestionDto | null = null;
  errorMsg: string | null = null;

  result: AnswerResultInviteDto | null = null;

  userAnswer: string = '';

  resultUser: ResponseAnswerQuestion | null = null;

  responseProgressQuestion: ResponseProgressQuestion | null = null;

  answerDto: AnswerDto | null = null;

  isFavorite: boolean | null = null;
  favoriteMsg: string | null = null;

  ngOnInit() {
    this.loadQuestion();
  }

  loadQuestion(): void {
    this.questionService.getOneQuestion(this.currentId).subscribe({
      next: (question) => {
        this.question = question;
        this.favoriteMsg = '';
        this.errorMsg = null;
        this.checkFavoriteInUser({ questionId: question.id });
      },
      error: () => {
        this.question = null;
        this.isFavorite = null;
        this.favoriteMsg = '';
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
    this.resultUser = null;
    this.result = null;
    this.loadQuestion();
  }

  restart(): void {
    this.currentId = 1;
    this.loadQuestion();
  }

  answerInvite(dto: AnswerDto) {
    this.questionService.postAnswerInvite(dto).subscribe({
      next: (res) => {
        this.result = res;
        this.errorMsg = null;
      },
      error: (_) => {
        this.result = null;
        this.errorMsg = 'Error al enviar la respuesta';
      },
    });
  }

  sendAnswer(dto: AnswerDto): void {

    localStorage.getItem('token')
      this.questionService.postUpdateProgress(dto).subscribe({
        next: (res: ResponseAnswerQuestion) => {
          this.resultUser = res;
          this.errorMsg = null;

          this.questionService.getReadProgress().subscribe({
            next: (progress: ResponseProgressQuestion) => {
              this.responseProgressQuestion = progress;
            },
            error: () => {
              this.errorMsg = 'No se pudo leer el progreso';
            },
          });
        },
        error: () => {
          this.resultUser = null;
          this.errorMsg = 'Error al enviar la respuesta';
        },
      });
    this.userAnswer = '';
  }

  toggleFavorite(dto: ToggleFavoriteDto): void {
    this.questionService.postToggleFavorite(dto).subscribe({
      next: (res: ToggleFavoriteResponseDto) => {
        this.isFavorite = res.favorite;
        this.favoriteMsg = res.message;
      },
      error: (err) => {
        this.isFavorite = null;
        this.favoriteMsg = 'Error al actualizar el estado de favorito';
      },
    });
  }

  checkFavoriteInUser(dto: ToggleFavoriteDto): void {
    this.questionService.getCheckFavoriteInUser(dto).subscribe({
      next: (res) => {
        this.isFavorite = res.favorite;
      },
      error: (err) => {
        this.isFavorite = null;
        this.favoriteMsg = 'Error al comprobar el estado de favorito';
      },
    });
  }

  checkLogIn(): boolean {
    const user = this.AuthService.getCurrentUser();
    if (user === null) {
      return (this.logIn = false);
    } else {
      return (this.logIn = true);
    }
  }
  // count(): number {
  //   const total = this.progress?.total ?? 142;
  //   return total - this.currentId;
  // }
}
