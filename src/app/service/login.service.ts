import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {User} from "../model/User";
import {
    catchError,
    Observable,
    tap,
    throwError
} from "rxjs";
import {Login} from "../model/Login";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

 url = '/api/v1/';
  login(username: string, password: string) {

    let httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: new HttpParams()
        .append("username",username)
        .append("password",password),
    };
    // try {
    //   this.http.post(this.url.concat("login"),null,httpOptions).subscribe((result: any) =>{
    //     localStorage.setItem('username', result.username);
    //     localStorage.setItem('token', result.token);
    //     localStorage.setItem('roles', result.roles);
    //   });
    //   return "Login successfull"
    // } catch (e) { return e;
    //
    // }

      return this.http.post(this.url.concat("login"), null, httpOptions).pipe(
          catchError((error) => {
              console.error('Login error', error);
              return throwError(error);
          })
      );
     }



  register(username: string, password: string): Observable<Login> {
    const body: User = {
      username,
      password
    }
    let httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<Login>(this.url.concat("users"),body,httpOptions);
  }
}
