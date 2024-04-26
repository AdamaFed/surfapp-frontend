import { Component } from '@angular/core';
import {RouterLinkActive, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-feedback-list',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './feedback-list.component.html',
  styleUrl: './feedback-list.component.css'
})
export class FeedbackListComponent {

}
