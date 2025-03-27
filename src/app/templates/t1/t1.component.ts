import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T1FooterComponent } from './t1-footer/t1-footer.component';
import { T1HeaderComponent } from './t1-header/t1-header.component';

@Component({
  selector: 'app-t1',
  imports: [T1HeaderComponent, T1FooterComponent, RouterModule],
  templateUrl: './t1.component.html',
  styleUrl: './t1.component.scss'
})
export class T1Component {
  userData = {
    name: 'James Doe',
    phone: '+47 333 78 901',
    email: 'john@doe.doe',
    heroBanner: 't1/images/brokerage.png',
    template: 't1',
    precounstSection: true
  }
}
