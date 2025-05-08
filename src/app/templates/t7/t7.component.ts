import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T7FooterComponent } from './t7-footer/t7-footer.component';
import { T7HeaderComponent } from './t7-header/t7-header.component';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t7',
  imports: [T7HeaderComponent, T7FooterComponent, RouterModule],
  templateUrl: './t7.component.html',
  styleUrl: './t7.component.scss',
})
export class T7Component {
  // @Input() userInfo = new UserModel();
  userData = {
    name: 'James Doe',
    phone: '+47 333 78 901',
    email: 'john@doe.doe',
    heroBanner: 't7/images/brokerage.png',
    template: 't7'
  }
}
