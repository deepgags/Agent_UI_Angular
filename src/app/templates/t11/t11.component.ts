import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T11HeaderComponent } from './t11-header/t11-header.component';
import { T11FooterComponent } from './t11-footer/t11-footer.component';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t11',
  imports: [T11HeaderComponent, T11FooterComponent, RouterModule],
  templateUrl: './t11.component.html',
  styleUrl: './t11.component.scss',
})
export class T11Component {
  // @Input() userInfo = new UserModel(); 
  userData = {
    name: 'James Doe',
    phone: '+49 333 99 901',
    email: 'john@doe.doe',
    heroBanner: 't9/images/brokerage.png',
    template: 't9'
  }
}
