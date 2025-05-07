import { Component } from '@angular/core';
import { ProfileComponent } from '../../../components/profile/profile.component';
import { TemplateComponent } from '../../../components/template/template.component';

@Component({
  selector: 'app-website-settings',
  imports: [ProfileComponent, TemplateComponent],
  templateUrl: './website-settings.component.html',
  styleUrl: './website-settings.component.scss'
})
export class WebsiteSettingsComponent {

}
