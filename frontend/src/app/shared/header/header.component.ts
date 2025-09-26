import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service.service';
import { createUserDto, UserDto } from '../../core/services/auth/dto/create.user';
import { loginUserDto } from '../../core/services/auth/dto/login.user';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  loginError: string | null = null;

  logUser: loginUserDto = {
    email: '',
    pass: '',
  };

  newAcc: createUserDto = {
    acc: '',
    email: '',
    pass: '',
  };

  user = computed(() => this.authService.currentUser());
  loggedIn = computed(() => this.authService.isLoggedIn());

  createUser(dto: createUserDto) {
    this.authService.createUser(dto).subscribe({
      error: (err) => {
        this.loginError = 'No se pudo registrar el usuario';
      },
    });
  }
  loginUser(dto: loginUserDto) {
    this.authService.loginUser(dto).subscribe({
      error: (err) => {
        this.loginError = 'Error al inicio de sesion. revisa tus credenciales';
      },
    });
  }

  logout() {
    this.authService.logout();
  }

 
}
