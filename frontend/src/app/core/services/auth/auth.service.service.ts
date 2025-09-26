import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { createUserDto, RegisterResponseDto, UserDto } from './dto/create.user';
import { LoginResponseDto, loginUserDto } from './dto/login.user';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiBase;

  currentUser = signal<UserDto | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  constructor() {
    this.restoreSession();
  }

  private storeToken(token: string) {
    localStorage.setItem('token', token);
  }
  private storeUser(user: UserDto) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getCurrentUser(): UserDto | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as UserDto) : null;
    } catch {
      return null;
    }
  }

  createUser(dto: createUserDto): Observable<RegisterResponseDto> {
    return this.http
      .post<RegisterResponseDto>(`${this.apiUrl}/auth/register`, dto)
      .pipe(
        tap(({ access_token, user }) => {
          this.storeToken(access_token);
          this.storeUser(user)
          this.currentUser.set(user);
        })
      );
  }

  loginUser(dto: loginUserDto): Observable<LoginResponseDto> {
    return this.http
      .post<LoginResponseDto>(`${this.apiUrl}/auth/login`, dto)
      .pipe(
        tap(({ access_token, user }) => {
          this.storeToken(access_token);
          this.storeUser(user);
          this.currentUser.set(user);
        })
      );
  }

  private restoreSession(): void {
    const token = this.getToken();
    const user = this.getCurrentUser();
    if (token && user) {
      this.currentUser.set(user);
    } else {
      this.currentUser.set(null);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }
}


