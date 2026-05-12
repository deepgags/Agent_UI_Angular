import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ApiClientService } from '../../core/services/api-client.service';
import { Property } from '../../core/models/property.model';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
})
export class PropertyDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiClient = inject(ApiClientService);

  property = signal<Property | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  activePhotoIndex = signal(0);
  lightboxOpen = signal(false);

  heroImage = computed(() => this.property()?.Media?.[0]?.MediaURL ?? null);
  photoUrls = computed(() =>
    (this.property()?.Media ?? [])
      .map((media: { MediaURL?: string; url?: string; Url?: string }) => media.MediaURL || media.url || media.Url)
      .filter((url): url is string => Boolean(url))
  );

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('No property ID found in route.');
      this.loading.set(false);
      return;
    }

    this.loadProperty(id);
  }

  loadProperty(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.apiClient.get<unknown>(`/properties/${id}`).subscribe({
      next: (res) => {
        const parsed = this.parsePropertyResponse(res);
        if (!parsed) {
          this.error.set('Property data was empty or in an unexpected format.');
          this.property.set(null);
          this.loading.set(false);
          return;
        }

        this.property.set(parsed);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load property: ' + (err?.message || 'Unknown error'));
        this.loading.set(false);
      },
    });
  }

  private parsePropertyResponse(payload: unknown): Property | null {
    if (!payload) {
      return null;
    }

    if (Array.isArray(payload)) {
      return (payload[0] as Property) ?? null;
    }

    if (typeof payload === 'object' && payload !== null) {
      const maybeData = (payload as { data?: unknown }).data;
      if (Array.isArray(maybeData)) {
        return (maybeData[0] as Property) ?? null;
      }
      if (maybeData && typeof maybeData === 'object') {
        return maybeData as Property;
      }
      return payload as Property;
    }

    return null;
  }

  getStatusValue() {
    return this.property()?.ContractStatus || this.property()?.MlsStatus || 'Unknown';
  }

  getStatusSeverity(status: string | undefined) {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warn';
      case 'sold':
        return 'danger';
      case 'withdrawn':
        return 'info';
      default:
        return 'contrast';
    }
  }

  formatList(items: string[] | undefined) {
    if (!items || items.length === 0) {
      return 'N/A';
    }
    return items.join(', ');
  }

  openLightbox(index: number) {
    this.activePhotoIndex.set(index);
    this.lightboxOpen.set(true);
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
  }

  showNextPhoto() {
    const photos = this.photoUrls();
    if (photos.length === 0) {
      return;
    }
    this.activePhotoIndex.set((this.activePhotoIndex() + 1) % photos.length);
  }

  showPreviousPhoto() {
    const photos = this.photoUrls();
    if (photos.length === 0) {
      return;
    }
    this.activePhotoIndex.set((this.activePhotoIndex() - 1 + photos.length) % photos.length);
  }

  goBack() {
    this.router.navigate(['/properties']);
  }
}
