import {Component, inject, OnInit} from '@angular/core';
import {UserService} from "../service/user.service";
import {User} from "../model/User";
import {
  CommonModule,
  NgForOf
} from "@angular/common";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    NgForOf, CommonModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  userService = inject(UserService);
  users: User[] = []

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe( (result: any) =>
    this.users = result);
  }

  deleteUser(id: string | undefined) {
    this.userService.deleteUser(id).subscribe(result =>
    console.log(result));
  }

  updateUser(id: string | undefined) {
    this.userService.updateUser(id).subscribe(result =>
      console.log(result));
  }
}
