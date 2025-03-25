import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-t-0001',
  imports: [],
  templateUrl: './t-0001.component.html',
  styleUrl: './t-0001.component.scss',
  standalone: true
})
export class T0001Component {
  @Input('userData') userData: any;
}
