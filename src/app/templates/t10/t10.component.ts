import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T10HeaderComponent } from './t10-header/t10-header.component';
import { T10FooterComponent } from './t10-footer/t10-footer.component';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t10',
  imports: [T10HeaderComponent, T10FooterComponent, RouterModule],
  templateUrl: './t10.component.html',
  styleUrl: './t10.component.scss',
})
export class T10Component {
  // @Input() userInfo = new UserModel(); 
  userData = {
    name: 'James Doe',
    phone: '+49 333 99 901',
    email: 'john@doe.doe',
    heroBanner: 't9/images/brokerage.png',
    template: 't9'
  }
}
