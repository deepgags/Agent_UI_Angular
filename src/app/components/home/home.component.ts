import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../../models/UserModel';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  // @ViewChild('customPlaceholder', { read: ViewContainerRef, static: true }) customPlaceholder!: ViewContainerRef;
  userInfo : UserModel;

  constructor(private router : Router,
    private storageService : StorageService,
    private vcr : ViewContainerRef
  ) {
   this.userInfo=this.storageService.getLoggedUserFromUserInfo();
  }

  signOut(data:string) {
    this.storageService.removeUserInfo()
    this.router.navigate(['/login']);
  }

  getNotification(evt:Event) {
  }

  async ngOnInit()
  {
  }
}
