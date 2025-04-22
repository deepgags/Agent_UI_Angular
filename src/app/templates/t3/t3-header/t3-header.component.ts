import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-t3-header',
  imports: [],
  templateUrl: './t3-header.component.html',
  styleUrls: ['./t3-header.component.scss', '../t3.component.scss']
})
export class T3HeaderComponent {
  @Input('userData') userData: any;
}
