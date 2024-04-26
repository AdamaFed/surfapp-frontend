import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Spot} from "../model/Spot";
import {Observable} from "rxjs";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) {
  }


  getLongLat(spot: Spot) : Observable<any> {
    const url = `/api/v1/location`;
    const token  = localStorage.getItem("token");

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      params: new HttpParams()
        .append("location",spot.name)
    };
    console.log(url);
    return this.http.get(url,httpOptions);
  }

  //Formel mit ChatGPT
  getDistanceOf(spotFrom:Spot, spotTo:Spot) {
    const R = 6371;

    const lat1 = (spotFrom.latitude * Math.PI) / 180;
    const long1 = (spotFrom.longitude * Math.PI) / 180;
    const lat2 = (spotTo.latitude * Math.PI) / 180;
    const long2 = (spotTo.longitude * Math.PI) / 180;


    const dLat = lat2 - lat1;
    const dLong = long2 - long1;


    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));


    return (R * c).toFixed(2);
  }

  async getCurrentPosition(): Promise<Spot> {
    let spotCurrentPosition: Spot = {name: "plz wait...", longitude: 0, latitude: 0, facing: 0};
    await navigator.geolocation.getCurrentPosition(position => {
      spotCurrentPosition.name = "position Located"
      spotCurrentPosition.latitude = position.coords.latitude;
      console.log(position.coords.latitude);
      spotCurrentPosition.longitude = position.coords.longitude;
      }, positionError => console.log(positionError)
    );

    return spotCurrentPosition;
  }


}
