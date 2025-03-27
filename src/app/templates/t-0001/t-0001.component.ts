import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-t-0001',
  imports: [],
  templateUrl: './t-0001.component.html',
  styleUrl: './t-0001.component.scss',
  standalone: true
})
export class T0001Component {
  @Input('userInfo') userInfo: any;
  @Output() notifySignout: EventEmitter<any> = new EventEmitter();

  sendNotification() {
    debugger;
    this.notifySignout.emit('Value send From Template1');
  }
}
