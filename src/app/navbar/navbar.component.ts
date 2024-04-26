import {Component, OnInit} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterModule
} from "@angular/router";
import {NgIf} from "@angular/common";
import {Login} from "../model/Login";
import {
  LogoutConfirmationDialogComponent
} from "../logout-confirmation-dialog/logout-confirmation-dialog.component";
import {
  MatDialog
} from "@angular/material/dialog";
import {ChatComponent} from "../chat/chat.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
    imports: [
        RouterLink,
        NgIf,
        RouterModule,
        ChatComponent
    ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  user: Login;
  isMenuOpen:boolean = false;

  constructor(private dialog: MatDialog, private router: Router) {
    this.user = {username: localStorage.getItem("username") ?? '',
      token: '',
      roles: localStorage.getItem("roles") ?? ''};

  }
  ngOnInit(): void {
    this.user = {username: localStorage.getItem("username") ?? '',
      token: '',
      roles: localStorage.getItem("roles") ?? ''};

  }


  logOut() {
    localStorage.clear();
    this.ngOnInit();
    this.router.navigate(['']);
  }

  public toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  openLogoutConfirmationDialog(): void {
    const dialogRef = this.dialog.open(LogoutConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.logOut();
      }
    });
  }


}
