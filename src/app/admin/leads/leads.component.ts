import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Page {
  sno: number;
  pageName: string;
  pageTitle: string;
  pageIndex: number;
  dated: string;
}

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, PaginatorModule,NavbarComponent,SidebarComponent],
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent {
  pages: Page[] = [
    { sno: 1, pageName: 'Home', pageTitle: 'Home', pageIndex: 1, dated: '8/12/2025 11:54:10 AM' },
    { sno: 2, pageName: 'About', pageTitle: 'About', pageIndex: 2, dated: '8/12/2025 11:55:06 AM' },
    { sno: 3, pageName: 'Services', pageTitle: 'Our Services', pageIndex: 3, dated: '8/12/2025 12:00:00 PM' },
    { sno: 4, pageName: 'Contact', pageTitle: 'Contact Us', pageIndex: 4, dated: '8/12/2025 12:05:00 PM' },
    { sno: 5, pageName: 'Blog', pageTitle: 'Blog', pageIndex: 5, dated: '8/12/2025 12:10:00 PM' },
    { sno: 6, pageName: 'FAQ', pageTitle: 'Frequently Asked Questions', pageIndex: 6, dated: '8/12/2025 12:15:00 PM' }
  ];

  pagedPages: Page[] = [];
  rows: number = 5;
  first: number = 0;

  constructor() {
    this.updatePagedData();
  }

  // ✅ This was missing earlier!
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePagedData();
  }

  updatePagedData() {
    this.pagedPages = this.pages.slice(this.first, this.first + this.rows);
  }

  createPage() {
    alert('Create Page clicked');
  }

  editPage(page: Page) {
    alert(`Editing page: ${page.pageName}`);
  }

  deletePage(page: Page) {
    if (confirm(`Are you sure you want to delete ${page.pageName}?`)) {
      this.pages = this.pages.filter(p => p.sno !== page.sno);
      this.updatePagedData();
    }
  }
}
