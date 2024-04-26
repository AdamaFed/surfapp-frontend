import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AssistentComponent} from "./assistent/assistent.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {
  ForecastComponent
} from "./forecast/forecast.component";
import {SpotListComponent} from "./spot-list/spot-list.component";
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import {
  FooterComponent
} from "./footer/footer.component";
import {UserService} from "./service/user.service";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective, RouterOutlet, AssistentComponent, NavbarComponent, ForecastComponent, SpotListComponent, RouterLink, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    provideEcharts(),
  ]
})
export class AppComponent{
  title = 'surf-app';



}
