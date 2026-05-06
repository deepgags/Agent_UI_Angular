import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    TopbarComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  template: `
    <div class="layout-wrapper">
      <app-sidebar></app-sidebar>
      <div class="layout-content">
        <app-topbar></app-topbar>
        <main class="layout-main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
    <p-toast position="top-right"></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `,
})
export class LayoutComponent {}