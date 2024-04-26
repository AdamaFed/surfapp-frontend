import { Component } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';


@Component({
  selector: 'app-logout-confirmation-dialog',
  templateUrl: './logout-confirmation-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
  ],
  styleUrl: './logout-confirmation-dialog.component.css',
})
export class LogoutConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<LogoutConfirmationDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
