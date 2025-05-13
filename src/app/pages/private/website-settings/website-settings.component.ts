import { Component } from '@angular/core';
// import { TemplateComponent } from '../../../components/template/template.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-website-settings',
  imports: [ProfileComponent, /*TemplateComponent */],
  templateUrl: './website-settings.component.html',
  styleUrl: './website-settings.component.scss'
})
export class WebsiteSettingsComponent {

}
