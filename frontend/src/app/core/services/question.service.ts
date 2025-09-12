import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AnswerInviteDto,
  QuestionDto,
  AnswerResultInviteDto,
} from './dto/dto.question';
import { Observable } from 'rxjs/internal/Observable';



@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = environment.apiBase;
  constructor(private http: HttpClient) {}

  getOneQuestion(lastId: number): Observable<QuestionDto> {
    return this.http.get<QuestionDto>(`${this.apiUrl}/question/invite/next`, {
      params: { lastId },
    });
  }

  postAnswerInvite(dto: AnswerInviteDto): Observable<AnswerResultInviteDto> {
    return this.http.post<AnswerResultInviteDto>(
      `${this.apiUrl}/question/invite/answer`,
      dto
    );
  }
}
