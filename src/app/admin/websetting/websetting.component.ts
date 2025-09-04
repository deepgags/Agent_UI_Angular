import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-websetting',
  standalone: true,
imports: [SidebarComponent,NavbarComponent],  
  templateUrl: './websetting.component.html',
  styleUrls: ['./websetting.component.scss']
})
export class WebsettingComponent {}
