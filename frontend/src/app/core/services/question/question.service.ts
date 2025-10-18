import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  AnswerDto,
  QuestionDto,
  AnswerResultInviteDto,
} from './dto/dto.question';
import { Observable } from 'rxjs/internal/Observable';
import { AnswerUserDto } from './dto/Answer.question.user';
import { ToggleFavoriteDto, ToggleFavoriteResponseDto } from './dto/toggle.question';
import { AuthService } from '../auth/auth.service.service';
import { ResponseAnswerQuestion, ResponseProgressQuestion } from './dto/response.question.user';




@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = environment.apiBase;
  constructor(private http: HttpClient, private auth: AuthService) {}

  getOneQuestion(lastId: number): Observable<QuestionDto> {
    return this.http.get<QuestionDto>(`${this.apiUrl}/question/invite/next`, {
      params: { lastId },
    });
  }

  postAnswerInvite(dto: AnswerDto): Observable<AnswerResultInviteDto> {
    return this.http.post<AnswerResultInviteDto>(
      `${this.apiUrl}/question/invite/answer`,
      dto
    );
  }

  postUpdateProgress(dto: AnswerUserDto): Observable<ResponseAnswerQuestion> {
    const token = this.auth.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<ResponseAnswerQuestion>(
      `${this.apiUrl}/question/progress`,
      dto,
      { headers }
    );
  }

  getReadProgress(): Observable<ResponseProgressQuestion>{
     const token = this.auth.getToken();
     const headers = { Authorization: `Bearer ${token}` };
     return this.http.get<ResponseProgressQuestion>(`${this.apiUrl}/question/progress`, {headers})
  };

  postToggleFavorite(
    dto: ToggleFavoriteDto
  ): Observable<ToggleFavoriteResponseDto> {
    const token = this.auth.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<ToggleFavoriteResponseDto>(
      `${this.apiUrl}/question/favorite/toggle`,
      dto,
      { headers }
    );
  }

  getFavorites(): Observable<QuestionDto[]> {
    const token = this.auth.getToken();
    const header = { Authorization: `Bearer ${token}` };
    return this.http.get<QuestionDto[]>(`${this.apiUrl}/question/favorites`, {
      headers: header,
    });
  }

  getCheckFavoriteInUser(
    dto: ToggleFavoriteDto
  ): Observable<{ favorite: boolean }> {
    const token = this.auth.getToken();
    const header = { Authorization: `Bearer ${token}` };
    return this.http.get<{ favorite: boolean }>(
      `${this.apiUrl}/question/favorite/${dto.questionId}`,
      { headers: header }
    );
  }
}
