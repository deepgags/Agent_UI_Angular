import { Component, inject, OnInit } from '@angular/core';
import { T0001Component } from '../../templates/t-0001/t-0001.component';
import { T0002Component } from '../../templates/t-0002/t-0002.component';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-properties',
   standalone: true,
   imports: [CommonModule, T0001Component, T0002Component],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent {
  userData = {
    name: 'James Doe',
    phone: '+47 333 78 901',
    email: 'john@doe.doe',
    heroBanner: 't1/images/brokerage.png',
    template: 't1',
    precounstSection: true
  }

}
