import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ProfileComponent,TemplateComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

}
