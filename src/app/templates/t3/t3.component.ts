import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T3FooterComponent } from './t3-footer/t3-footer.component';
import { T3HeaderComponent } from './t3-header/t3-header.component';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t3',
  imports: [T3HeaderComponent, T3FooterComponent, RouterModule],
  templateUrl: './t3.component.html',
  styleUrl: './t3.component.scss',
})
export class T3Component {
  // @Input() userInfo = new UserModel();
  userData = {
    name: 'James Doe',
    phone: '+47 333 78 901',
    email: 'john@doe.doe',
    heroBanner: 't3/images/brokerage.png',
    template: 't3'
  }
}
