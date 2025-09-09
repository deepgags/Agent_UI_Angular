import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

interface Product {
  code: string;
  name: string;
  category: string;
  quantity: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, TableModule, CardModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  products: Product[] = [
    { code: 'P1001', name: 'Laptop', category: 'Electronics', quantity: 12 },
    { code: 'P1002', name: 'Phone', category: 'Electronics', quantity: 30 },
    { code: 'P1003', name: 'Shirt', category: 'Clothing', quantity: 45 },
    { code: 'P1004', name: 'Book', category: 'Stationery', quantity: 20 },
    { code: 'P1005', name: 'Shoes', category: 'Footwear', quantity: 15 }
  ];
}
