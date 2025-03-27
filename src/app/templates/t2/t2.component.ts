import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { T2FooterComponent } from './t2-footer/t2-footer.component';
import { T2HeaderComponent } from './t2-header/t2-header.component';

@Component({
  selector: 'app-t2',
  imports: [T2HeaderComponent, T2FooterComponent, RouterModule],
  templateUrl: './t2.component.html',
  styleUrl: './t2.component.scss'
})
export class T2Component {
  userData = {
    name: 'James Doe',
    phone: '+47 333 78 901',
    email: 'john@doe.doe',
    heroBanner: 't2/images/brokerage.png',
    template: 't2'
  }

}
