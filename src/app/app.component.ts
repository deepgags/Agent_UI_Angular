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

  private style: HTMLLinkElement | null = null;
  private cssFile: string = "";

  constructor(
    public loadingService: LoadingService,
    private router: Router,
    private storageService: StorageService,
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
  ){ }

  ngOnInit() {
    this.loadTemplateStyles();
   }

   loadTemplateStyles() {
    const userInfo = this.storageService.getLoggedUserFromUserInfo();
      switch (userInfo.templateId) {
        case '0b69c6031f111d63bc2c975dd2837e38': 
        this.cssFile = `GreenTemplate.css`; 
          break;
        case '0b69c6031f111d63bc2c975dd2837e39': 
        this.cssFile = `BlueTemplate.css`;    
          break;
      }
    
    this.style = this.renderer2.createElement('link') as HTMLLinkElement;

    // Set type of the link item and path to the css file
    this.renderer2.setProperty(this.style, 'rel', 'stylesheet');
    this.renderer2.setProperty(this.style, 'href', this.cssFile);
    this.renderer2.setProperty(this.style, 'id', "themeCSS");

    // Add the style to the head section
    this.renderer2.appendChild(this.document.head, this.style);
  }


}
