import {Component, inject, OnInit} from '@angular/core';
import {CreateSpotComponent} from "../create-spot/create-spot.component";
import {RouterLinkActive, RouterOutlet} from "@angular/router";



@Component({
  selector: 'app-spot-list',
  standalone: true,
  imports: [
    CreateSpotComponent,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './spot-list.component.html',
  styleUrl: './spot-list.component.css'
})
export class SpotListComponent {



}
