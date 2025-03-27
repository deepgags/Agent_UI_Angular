import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';  // Importing Material Snackbar

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  config = new MatSnackBarConfig();

  constructor(private snackBar: MatSnackBar) {
    this.config.panelClass = ['orange-snackbar'];
    this.config.duration=3000000;
    this.config.horizontalPosition = 'right';
    this.config.verticalPosition='top';
  }

  showNotification(message: string, action: string = 'OK') {
    this.snackBar.open(message, action, this.config);
  }
}