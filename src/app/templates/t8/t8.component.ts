import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T8HeaderComponent } from './t8-header/t8-header.component';
import { T8FooterComponent } from './t8-footer/t8-footer.component';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t8',
  imports: [T8HeaderComponent, T8FooterComponent, RouterModule],
  templateUrl: './t8.component.html',
  styleUrl: './t8.component.scss',
})
export class T8Component {
  // @Input() userInfo = new UserModel(); 
  userData = {
    name: 'James Doe',
    phone: '+48 333 88 901',
    email: 'john@doe.doe',
    heroBanner: 't8/images/brokerage.png',
    template: 't8'
  }
}
