import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from "@angular/common/http";
import {Forecast} from "../model/Forecast";
import {Spot} from "../model/Spot";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  private marineApiUrl = 'https://marine-api.open-meteo.com/v1/marine';
  private windApiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) { }

  getMarineForecast(latitude: number, longitude: number, startDate: string, endDate: string): Observable<any> {
    const url = `${this.marineApiUrl}?latitude=${latitude}&longitude=${longitude}&hourly=wave_height,wave_direction&timezone=Europe%2FBerlin&start_date=${startDate}&end_date=${endDate}`;
    return this.http.get<any[]>(url);
  }

  getWindForecast(latitude: number, longitude: number, startDate: string, endDate: string): Observable<any> {
    const url = `${this.windApiUrl}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,wind_direction_10m&timezone=Europe%2FBerlin&start_date=${startDate}&end_date=${endDate}`;

    return this.http.get<any[]>(url);
  }

  // filterWaveHeight(originalForecasts: any, threshold: number): any {
  //   if (originalForecasts && Array.isArray(originalForecasts.wave_height)) {
  //     const filteredWaveHeight = originalForecasts.wave_height.filter((height: number) => height <= threshold);
  //     return {
  //       time: originalForecasts.time,
  //       wave_height: filteredWaveHeight,
  //       wave_direction: originalForecasts.wave_direction
  //     };
  //   } else {
  //     return originalForecasts;
  //   }
  // }

  filterWaveHeight(originalForecasts: { time: string[], wave_height: number[], wave_direction: number[] }, threshold: number): any {
    if (originalForecasts && Array.isArray(originalForecasts.wave_height)) {
      const filteredData = originalForecasts.wave_height
        .map((height: number, index: number) => ({
          originalIndex: index,
          time: originalForecasts.time[index],
          wave_height: height,
          wave_direction: originalForecasts.wave_direction[index]
        }))
        .filter(entry => entry.wave_height <= threshold);

      return filteredData;
    } else {
      return originalForecasts;
    }
  }

  // filterWindSpeed(originalForecasts: any, threshold: number): any {
  //   if (originalForecasts && Array.isArray(originalForecasts.wind_speed_10m)) {
  //     const filteredWindSpeed = originalForecasts.wind_speed_10m.filter((speed: number) => speed <= threshold);
  //     return {
  //       time: originalForecasts.time,
  //       wind_speed_10m: filteredWindSpeed,
  //       wind_direction_10m: originalForecasts.wind_direction_10m
  //     };
  //   } else {
  //     return originalForecasts;
  //   }
  // }

  filterWindSpeed(originalForecasts: { time: string[], wind_speed_10m: number[], wind_direction_10m: number[] }, threshold: number): any {
    if (originalForecasts && Array.isArray(originalForecasts.wind_speed_10m)) {
      const filteredData = originalForecasts.wind_speed_10m
        .map((speed: number, index: number) => ({
          originalIndex: index,
          time: originalForecasts.time[index],
          wind_speed_10m: speed,
          wind_direction_10m: originalForecasts.wind_direction_10m[index]
        }))
        .filter(entry => entry.wind_speed_10m <= threshold);

      return filteredData;
    } else {
      return originalForecasts;
    }
  }


}
