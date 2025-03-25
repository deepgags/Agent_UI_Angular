import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { T0001Component } from '../../../templates/t-0001/t-0001.component';
import { T0002Component } from '../../../templates/t-0002/t-0002.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, T0001Component, T0002Component],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userData = {
    name: 'James Doe',
    phone: '+47 333 78 901',
    email: 'john@doe.doe',
    heroBanner: 't1/images/brokerage.png',
    template: 't1',
    precounstSection: true
  }
}
