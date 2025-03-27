import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-t1-header',
  imports: [],
  templateUrl: './t1-header.component.html',
  styleUrls: ['./t1-header.component.scss', '../t1.component.scss']
})
export class T1HeaderComponent {
  @Input('userData') userData: any;
}
