import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MenuModule, ButtonModule],
  template: `
    <div class="layout-topbar">
      <div class="topbar-left">
        <div class="breadcrumb">
          <a routerLink="/dashboard" class="breadcrumb-item">
            <i class="pi pi-home"></i>
          </a>
        </div>
      </div>
      <div class="topbar-right">
        <button pButton type="button" icon="pi pi-user" class="p-button-text" (click)="menu.toggle($event)"></button>
        <p-menu #menu [model]="menuItems" [popup]="true" appendTo="body" styleClass="topbar-account-menu"></p-menu>
      </div>
    </div>
  `,
})
export class TopbarComponent {
  private authService = inject(AuthService);

  menuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      routerLink: '/profile',
    },
    {
      separator: true,
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.authService.logout(),
    },
  ];
}