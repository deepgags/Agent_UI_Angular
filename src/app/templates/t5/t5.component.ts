import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T5FooterComponent } from './t5-footer/t5-footer.component';
import { T5HeaderComponent } from './t5-header/t5-header.component';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t5',
  imports: [T5HeaderComponent, T5FooterComponent, RouterModule],
  templateUrl: './t5.component.html',
  styleUrl: './t5.component.scss',
})
export class T5Component {
  // @Input() userInfo = new UserModel();
  userData = {
    name: 'James Doe',
    phone: '+47 333 78 901',
    email: 'john@doe.doe',
    heroBanner: 't5/images/brokerage.png',
    template: 't5'
  }
}
