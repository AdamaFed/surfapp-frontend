import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Spot} from "../model/Spot";
import {Feedback} from "../model/Feedback";
import {User} from "../model/User";
import {Condition} from "../model/Condition";
import {formatDate} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }


  url = '/api';
  getAllComments() {
    const token  = localStorage.getItem("token");
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    console.log(httpOptions);
    return this.http.get<Comment[]>(this.url.concat("/comment"),httpOptions);
  }

  getAllConditions() {
    const token  = localStorage.getItem("token");
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    console.log(httpOptions);
    return this.http.get<Condition[]>(this.url.concat("/condition"),httpOptions);
  }


  newCondition(spotId: number, windDirection: number,windSpeed: number, rating: number) {
    const body: Object ={
      spotId: spotId,
      windDirection: windDirection,
      windSpeed: windSpeed,
      rating: rating,
    }
    console.log(body);
    const token  = localStorage.getItem("token");
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post(this.url.concat("/condition"),body,httpOptions);
  }


  newComment(spotId: number, comment: string) {
    const body: Object ={
      spotId: spotId,
      text: comment,
      date: this.formatDate(Date.now()),
      username: localStorage.getItem("username")
    }
    console.log(body);
    const token  = localStorage.getItem("token");
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post(this.url.concat("/comment"),body,httpOptions);
  }

  formatDate(dateInMilliseconds: number): string {
    let date = new Date(dateInMilliseconds);
    let month = '' + (date.getMonth() + 1), // In JS month begin at 0
      day = '' + date.getDate(),
      year = date.getFullYear();
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    let dateNew = [year, month, day].join('-');
    return dateNew.concat(" " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()));
  }


  // KOMPASS
  compassDirections = ['E', 'SE', 'S', 'SW', 'W', 'NW','N', 'NE'];
  centerX = 100;
  centerY = 100;

  calculateLabelX(direction: string): number {
    const labelRadius = 90;
    const angle = this.getCompassDirectionAngle(direction);
    return this.centerX + labelRadius * Math.cos(angle);
  }

  calculateLabelY(direction: string): number {
    const labelRadius = 90;
    const angle = this.getCompassDirectionAngle(direction);
    return this.centerY + labelRadius * Math.sin(angle);
  }

  private getCompassDirectionAngle(direction: string): number {
    const directions = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'];
    const index = directions.indexOf(direction);
    const totalDirections = directions.length;
    return (360 / totalDirections) * index * (Math.PI / 180);
  }

  calculateX2(condition: Condition): number {
    // Berechne die X2-Koordinate basierend auf der Windrichtung und Länge
    return this.centerX + condition.windSpeed*2 * Math.cos((condition.windDirection - 90) * (Math.PI / 180));
  }

  calculateY2(condition: Condition): number {
    // Berechne die Y2-Koordinate basierend auf der Windrichtung und Länge
    return this.centerY + condition.windSpeed*2 * Math.sin((condition.windDirection - 90) * (Math.PI / 180));
  }

  colorOf(condition: Condition): string {
    if (condition.rating <= 2) {
      return "red";
    } else if (condition.rating <= 4) {
      return "orange";
    } else if (condition.rating <= 6) {
      return "yellow";
    } else if (condition.rating <= 8) {
      return "forestgreen";
    } else {
      return "darkgreen";
    }
  }




}
