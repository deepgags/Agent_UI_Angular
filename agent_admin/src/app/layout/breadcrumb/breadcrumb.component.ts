import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="breadcrumb">
      @for (item of items(); track item.label; let last = $last) {
        @if (item.route && !last) {
          <a [routerLink]="item.route" class="breadcrumb-item">{{ item.label }}</a>
          <span class="breadcrumb-separator">/</span>
        } @else {
          <span class="breadcrumb-item active">{{ item.label }}</span>
        }
      }
    </nav>
  `,
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
}