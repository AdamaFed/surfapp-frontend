import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Spot} from "../model/Spot";
import {User} from "../model/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  url = '/api/v1/users';

  getAllUsers(): Observable<User[]> {
    const token  = localStorage.getItem("token");
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<User[]>(this.url.concat("/all"),httpOptions);
  }


  deleteUser(id: string | undefined) {
    const token  = localStorage.getItem("token");
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.delete(this.url.concat(`/${id}`),httpOptions);
  }

  updateUser(id: string | undefined) {
    const token  = localStorage.getItem("token");
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.put(this.url.concat(`/${id}`), null, httpOptions);
  }

  // fetchUser(){
  //   const token  = localStorage.getItem("token");
  //   let httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`
  //     })
  //   };
  //   return this.http.get<User>(this.url.concat("/me"),httpOptions);
  // }
  boolean = false;
  fetchUser(): boolean{
    const token  = localStorage.getItem("token");
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    this.http.get<User>(this.url.concat("/me"),httpOptions).subscribe(result => {
      if ((result.username === localStorage.getItem("username")) && result.role === localStorage.getItem("roles")) {
        this.boolean = true;
      } else {
        this.boolean = false;
      }
    });
    return this.boolean;
  }

}
