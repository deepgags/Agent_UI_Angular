import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { T0001Component } from '../../templates/t-0001/t-0001.component';
import { T0002Component } from '../../templates/t-0002/t-0002.component';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-home',
  imports: [CommonModule, T0001Component, T0002Component],
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
