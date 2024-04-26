import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders, HttpParams
} from '@angular/common/http';
import {WindData} from "../model/WindData";
import {WaveData} from "../model/WaveData";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private username = 'akquinet_sage_adam';
  private password = '6LZV0yS0ae';

  constructor(private http: HttpClient) {}

  fetchWindData(latitude: number, longitude: number, startHour: string, endHour: string): Observable<WindData> {
    const params = {
      latitude,
      longitude,
      hourly: ["wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
      wind_speed_unit: "kn",
      timezone: "auto",
      start_hour: startHour,
      end_hour: endHour
    };
    const url = "https://api.open-meteo.com/v1/forecast";

    return this.http.get<WindData>(url, { params });
  }

  fetchWaveData(latitude: number, longitude: number, startHour: string, endHour: string): Observable<WaveData> {
    const params = {
      latitude,
      longitude,
      hourly: ["wave_height", "wave_direction"],
      timezone: "auto",
      start_hour: startHour,
      end_hour: endHour
    };
    const url = "https://marine-api.open-meteo.com/v1/marine";

    return this.http.get<WaveData>(url, { params });
  }


  fetchTideData(latitude: number, longitude: number, startDate: string, endDate: string): Observable<any> {
    const formattedStartDate = this.formatDateForMeteomatics(startDate, '00:00');
    const formattedEndDate = this.formatDateForMeteomatics(endDate, '00:00');
    const url = `https://api.meteomatics.com/${formattedStartDate}--${formattedEndDate}:PT1H/first_low_tide:sql,first_high_tide:sql,second_low_tide:sql,second_high_tide:sql,tidal_amplitude:cm/${latitude},${longitude}/json?model=mix`;

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`)
    });

    return this.http.get<any>(url, { headers });
  }
  fetchTideData2(latitude: number, longitude: number, startDate: string, endDate: string): Observable<any> {
    const formattedStartDate = this.formatDateForMeteomatics(startDate, '00:00');
    const formattedEndDate = this.formatDateForMeteomatics(endDate, '23:00');
    const url = `/api/v1/meteomatics`;
    const token  = localStorage.getItem("token");

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      params: new HttpParams()
        .append("latitude",latitude)
        .append("longitude",longitude)
        .append("startDate",formattedStartDate)
        .append("endDate",formattedEndDate)
    };



    return this.http.get<any>(url, httpOptions);
  }




  private formatDateForMeteomatics(date: string, time: string): string {
    const parts = date.split('-');
    const formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
    return `${formattedDate}T${time}:00.000+00:00`;
  }






}
