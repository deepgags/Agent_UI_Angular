import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { navItems } from './nav.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="layout-sidebar">
      <div class="sidebar-logo">
        <i class="pi pi-box"></i>
        <span>Agent Admin</span>
      </div>
      <nav class="sidebar-nav">
        @for (item of navItems; track item.route) {
          @if (!item.children) {
            <a [routerLink]="item.route" routerLinkActive="active" class="nav-item">
              <i [class]="item.icon"></i>
              <span>{{ item.label }}</span>
            </a>
          } @else {
            <div class="nav-section">{{ item.label }}</div>
            @for (child of item.children; track child.route) {
              <a [routerLink]="child.route" routerLinkActive="active" class="nav-item child">
                <i [class]="child.icon"></i>
                <span>{{ child.label }}</span>
              </a>
            }
          }
        }
      </nav>
    </div>
  `,
})
export class SidebarComponent {
  navItems = navItems;
}