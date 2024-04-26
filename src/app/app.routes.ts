import { Routes } from '@angular/router';
import {AssistentComponent} from "./assistent/assistent.component";
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";
import {SpotListComponent} from "./spot-list/spot-list.component";
import {createComponent} from "@angular/core";
import {CreateSpotComponent} from "./create-spot/create-spot.component";
import {ChatComponent} from "./chat/chat.component";
import {EventComponent} from "./event/event.component";
import {FeedbackComponent} from "./feedback/feedback/feedback.component";
import {UserComponent} from "./user/user.component";
import {SpotForecastComponent} from "./spot-forecast/spot-forecast.component";
import {AdminComponent} from "./admin/admin.component";
import {OnlyLoggedInGuard} from "./guards/OnlyLoggedInGuard";
import {AlwaysAuthGuardNew} from "./guards/AlwaysAuthGuard";
import {HomeComponent} from "./home/home.component";
import {UserGuard} from "./guards/UserGuard";
import {AdminGuard} from "./guards/AdminGuard";
import {FeedbackListComponent} from "./feedback-list/feedback-list.component";

export const routes: Routes = [
  {path: "" , component: HomeComponent},
  {path: "assistant" , component: AssistentComponent},
  {path: "login" , component: LoginComponent},
  {path: "registration" , component: RegistrationComponent},
  { path: '', redirectTo: 'feedback', pathMatch: 'full'},




  {path: "chat" , component: ChatComponent},
  {path: "events" , component: EventComponent},
  {path: "spot-forecast" , component: SpotForecastComponent},

  {path: "feedback-list" , component: FeedbackListComponent, canActivate: [UserGuard], children: [
  {path: "feedback" , component: FeedbackComponent, title: 'Feedback-List'},
  { path: '', redirectTo: 'feedback', pathMatch: 'full'},
  ]},

  {path: "list" , component: SpotListComponent,
    canActivate: [UserGuard], children: [
      {path: "spots" , component: CreateSpotComponent, title: 'Spot-List'},
      { path: '', redirectTo: 'spots', pathMatch: 'full'},
    ]},


  {path: "admin" , component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {path: "user" , component: UserComponent, title: 'User-List'},
      { path: '', redirectTo: 'user', pathMatch: 'full'},
    ]},

];
