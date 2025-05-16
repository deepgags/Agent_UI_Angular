import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T12HeaderComponent } from './t12-header/t12-header.component';
import { T12FooterComponent } from './t12-footer/t12-footer.component';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t12',
  imports: [T12HeaderComponent, T12FooterComponent, RouterModule],
  templateUrl: './t12.component.html',
  styleUrl: './t12.component.scss',
})
export class T12Component {
  // @Input() userInfo = new UserModel(); 
  userData = {
    name: 'James Doe',
    phone: '+49 333 99 901',
    email: 'john@doe.doe',
    heroBanner: 't9/images/brokerage.png',
    template: 't9'
  }
}
