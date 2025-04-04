import { ChangeDetectionStrategy, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StorageService } from './services/storage.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(
    public loadingService: LoadingService,
    
  ){ }

  ngOnInit() {
    
   }
}
