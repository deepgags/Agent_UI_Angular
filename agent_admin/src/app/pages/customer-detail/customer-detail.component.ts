import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ApiClientService } from '../../core/services/api-client.service';
import { MenusComponent } from '../menus/menus.component';
import { PagesComponent } from '../pages/pages.component';
import { TeamMembersComponent } from '../team-members/team-members.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { CustomerCitiesComponent } from '../customer-cities/customer-cities.component';
import { LeadsComponent } from '../leads/leads.component';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

interface Customer {
  _id: string;
  businessName: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  role: 'Agent' | 'Broker';
  isApproved: boolean;
  createdAt: string;
}

type TabType = 'menus' | 'pages' | 'team-members' | 'testimonials' | 'cities' | 'leads';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TagModule,
    MenusComponent,
    PagesComponent,
    TeamMembersComponent,
    TestimonialsComponent,
    CustomerCitiesComponent,
    LeadsComponent,
  ],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss',
})
export class CustomerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiClient = inject(ApiClientService);

  customerId = signal<string>('');
  customer = signal<Customer | null>(null);
  activeTab = signal<TabType>('menus');

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id')!;
          this.customerId.set(id);
          return this.apiClient.get<Customer>(`/customers/${id}`);
        })
      )
      .subscribe({
        next: (res) => this.customer.set(res as any),
        error: () => this.router.navigate(['/customers']),
      });
  }

  goBack() {
    this.router.navigate(['/customers']);
  }

  getStatusSeverity(isApproved: boolean) {
    return isApproved ? 'success' : 'warn';
  }

  getStatusLabel(isApproved: boolean) {
    return isApproved ? 'Active' : 'Pending';
  }
}
