import { Component, inject, OnInit } from '@angular/core';
import { QuestionService } from '../../core/services/question.service';
import { QuestionDto } from '../../core/services/dto/dto.question';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly questionService = inject(QuestionService);

  currentId = 142;
  question: QuestionDto | null = null;
  errorMsg: string | null = null;

  ngOnInit() {
    this.loadQuestion();
  }

  loadQuestion():void{
    this.questionService.getOneQuestion(this.currentId).subscribe({
      next:(question) => {
        this.question = question;
        this.errorMsg = null;
      },
      error: () => {
        this.question = null;
        this.errorMsg = 'No hay más preguntas disponibles';
      }
    })
  }

  nextQuestion():void{
    this.currentId++;
    this.loadQuestion();
  }
  restart():void{
    this.currentId = 1;
    this.loadQuestion();
  }


}
