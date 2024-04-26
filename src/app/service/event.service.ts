import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Event} from "../model/Event";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }
  url = '/api/events';

  getAllEvents(): Observable<Event[]> {
    const token  = localStorage.getItem("token");

    // = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwibmJmIjoxNzAzMTU5OTQyLCJyb2xlcyI6IlVTRVIiLCJleHAiOjE3MDMyNDYzNDJ9.YDiY-48Os1vsg3NDopeh-0g-9btJayI4tlNttKfokRogPyu4DRHvhxQjJZVHBl1mdDMFmIZjB_ITbaNLRcBNQH48H2TVuVS4WnOyU-4aS_YF8G-vyqX2YHWBzkjQ_dMXmE3JZM20ucrg_QVaSmGsCeD12GP61lwiCjTHtxcjx3wgJvQk-3Lqb5lFg4xbePF278phhh628a-O3-Xg27v58nORNv3F3WddkQSpEwsPJrHlj7JTiUZvSGdQF8g-nOtQHORu8_NrRE6tDrNYOoZCVDu4ob1ioB5QMJOQSnEXrdavNYp3XZr9z930-rHQNtEH_vQe-Ylde4rzyT4Hzvnwsw"


    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    console.log(httpOptions);
    return this.http.get<Event[]>(this.url,httpOptions);
  }

  addEvent(event: Event): Observable<any>{
    const token  = localStorage.getItem("token");
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    console.log(httpOptions);
    return this.http.post(this.url,event,httpOptions);
  }
}
