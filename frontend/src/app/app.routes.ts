import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   loadComponent: () =>
  //     import('./pages/home/home.component').then((c) => c.HomeComponent),
  // },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/quiz/quiz.component').then((c) => c.QuizComponent),
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./pages/quiz/account-banner/account-banner.component').then((c)=> c.AccountBannerComponent)
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites.component').then(
        (c) => c.FavoritesComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
  },
];
