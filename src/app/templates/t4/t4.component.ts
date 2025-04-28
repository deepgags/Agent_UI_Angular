import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T4FooterComponent } from './t4-footer/t4-footer.component';
import { T4HeaderComponent } from './t4-header/t4-header.component';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t4',
  imports: [T4HeaderComponent, T4FooterComponent, RouterModule],
  templateUrl: './t4.component.html',
  styleUrl: './t4.component.scss',
})
export class T4Component {
  // @Input() userInfo = new UserModel();
  userData = {
    name: 'James Doe',
    phone: '+47 333 78 901',
    email: 'john@doe.doe',
    heroBanner: 't4/images/brokerage.png',
    template: 't4'
  }
}
