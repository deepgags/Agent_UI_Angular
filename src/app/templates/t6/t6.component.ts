import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T6FooterComponent } from './t6-footer/t6-footer.component';
import { T6HeaderComponent } from './t6-header/t6-header.component';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t6',
  imports: [T6HeaderComponent, T6FooterComponent, RouterModule],
  templateUrl: './t6.component.html',
  styleUrl: './t6.component.scss',
})
export class T6Component {
  // @Input() userInfo = new UserModel();
  userData = {
    name: 'James Doe',
    phone: '+47 333 78 901',
    email: 'john@doe.doe',
    heroBanner: 't6/images/brokerage.png',
    template: 't6'
  }
}
