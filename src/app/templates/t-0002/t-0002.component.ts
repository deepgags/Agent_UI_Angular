import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-t-0002',
  imports: [],
  templateUrl: './t-0002.component.html',
  styleUrl: './t-0002.component.scss',
  standalone: true
})
export class T0002Component {
  @Input('userInfo') userInfo: any;
  @Output() notifySignout: EventEmitter<any> = new EventEmitter();

  sendNotification() {
    this.notifySignout.emit('Value send From Template2');
  }
}
