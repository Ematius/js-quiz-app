import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-banner',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './account-banner.component.html',
  styleUrl: './account-banner.component.scss',
})
export class AccountBannerComponent {

}
