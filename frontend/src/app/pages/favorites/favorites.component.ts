import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionDto } from '../../core/services/question/dto/dto.question';
import { QuestionService } from '../../core/services/question/question.service';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-favorites',
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  private readonly questionService = inject(QuestionService);

  favorites = signal<QuestionDto[]>([]);

  constructor() {}

  ngOnInit() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.questionService.getFavorites().subscribe({
      next: (res) => {
        this.favorites.set(res);
      },
      error: (err) => console.error('Error al cargar favoritos', err),
    });
  }
}
