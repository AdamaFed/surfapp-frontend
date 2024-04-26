import { Injectable } from '@angular/core';
import {Spot} from "../model/Spot";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ChatElement} from "../model/ChatElement";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatGptService {

  constructor(private http: HttpClient) { }
  url = '/api/gpt';

  sendRequest(chatElement: ChatElement): Observable<ChatElement> {
    const token  = localStorage.getItem("token");

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    console.log(httpOptions);
    return this.http.post<ChatElement>(this.url,chatElement,httpOptions);
  }
}
