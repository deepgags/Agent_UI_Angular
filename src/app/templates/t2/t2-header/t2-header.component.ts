import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-t2-header',
  imports: [],
  templateUrl: './t2-header.component.html',
  styleUrls: ['./t2-header.component.scss', '../t2.component.scss']
})
export class T2HeaderComponent {
  @Input('userData') userData: any;
}
