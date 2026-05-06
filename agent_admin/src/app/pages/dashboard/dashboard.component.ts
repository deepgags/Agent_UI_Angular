import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ApiClientService } from '../../core/services/api-client.service';

interface DashboardSummary {
  totalCustomers: number;
  approvedCustomers: number;
  pendingCustomers: number;
  totalLeads: number;
  totalUsers: number;
  totalProperties: number;
  totalTemplates: number;
  totalTestimonials: number;
  recentCustomers: any[];
  recentLeads: { date: string; count: number }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private apiClient = inject(ApiClientService);

  summary = signal<DashboardSummary>({
    totalCustomers: 0,
    approvedCustomers: 0,
    pendingCustomers: 0,
    totalLeads: 0,
    totalUsers: 0,
    totalProperties: 0,
    totalTemplates: 0,
    totalTestimonials: 0,
    recentCustomers: [],
    recentLeads: [],
  });

  chartData = signal<any>({
    labels: [],
    datasets: [],
  });

  chartOptions = signal<any>({
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  });

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.apiClient.get<DashboardSummary>('/dashboard/summary').subscribe({
      next: (data) => {
        this.summary.set(data);
        const labels = data.recentLeads.map((l: { date: string }) => l.date);
        const values = data.recentLeads.map((l: { count: number }) => l.count);
        this.chartData.set({
          labels,
          datasets: [
            {
              label: 'Leads',
              data: values,
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              fill: true,
              tension: 0.4,
            },
          ],
        });
      },
      error: () => {
        this.summary.set({
          totalCustomers: 0,
          approvedCustomers: 0,
          pendingCustomers: 0,
          totalLeads: 0,
          totalUsers: 0,
          totalProperties: 0,
          totalTemplates: 0,
          totalTestimonials: 0,
          recentCustomers: [],
          recentLeads: [],
        });
      },
    });
  }
}