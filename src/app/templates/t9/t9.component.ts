import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T9HeaderComponent } from './t9-header/t9-header.component';
import { T9FooterComponent } from './t9-footer/t9-footer.component';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t9',
  imports: [T9HeaderComponent, T9FooterComponent, RouterModule],
  templateUrl: './t9.component.html',
  styleUrl: './t9.component.scss',
})
export class T9Component {
  // @Input() userInfo = new UserModel(); 
  userData = {
    name: 'James Doe',
    phone: '+49 333 99 901',
    email: 'john@doe.doe',
    heroBanner: 't9/images/brokerage.png',
    template: 't9'
  }
}
