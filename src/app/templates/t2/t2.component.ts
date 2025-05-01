import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T2FooterComponent } from './t2-footer/t2-footer.component';
import { T2HeaderComponent } from './t2-header/t2-header.component';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t2',
  imports: [T2HeaderComponent, T2FooterComponent, RouterModule],
  templateUrl: './t2.component.html',
  styleUrl: './t2.component.scss',
})
export class T2Component {
 
  constructor( private renderer: Renderer2, private el: ElementRef) {
    this.renderer.setStyle(
      this.el.nativeElement,
      '--primary-color',
      '#002FD5'
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      '--secondary-color',
      '#FFFFFF'
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      '--third-color',
      '#000000'
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      '--fourth-color',
      '#222222'
    );
  }
}
