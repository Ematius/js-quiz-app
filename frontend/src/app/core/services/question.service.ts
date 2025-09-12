import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { QuestionDto } from './dto/dto.question';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = environment.apiBase;
  constructor(private http: HttpClient) {}

  getOneQuestion(lastId: number){
    return this.http.get<QuestionDto>(`${this.apiUrl}/question/invite/next`,{params:{lastId}});
  }

}
