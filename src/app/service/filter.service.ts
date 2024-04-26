import { Injectable } from '@angular/core';
import {WindData} from "../model/WindData";
import {WaveData} from "../model/WaveData";
import {WeatherService} from "./weather.service";
import {ChartService} from "./chart.service";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filteredWindData: WindData | null = null;
  filteredWaveData: WaveData | null = null;


  constructor(
      private weatherService: WeatherService,
      private chartService: ChartService,
  ) { }

  filterData(windMinValue: number, windMaxValue: number, waveMinValue: number, waveMaxValue: number) {
    const windData= this.weatherService.windData;
    const waveData= this.weatherService.waveData;

    if (windData && windData.hourly && waveData && waveData.hourly) {
      // Initialize filtered data
      this.filteredWindData = {
        ...windData, hourly: {
          time: [], wind_speed_10m: [], wind_direction_10m: [],
          wind_gusts_10m: []
        }
      };
      this.filteredWaveData = {
        ...waveData, hourly: {
          time: [], wave_height: [],
          wave_direction: []
        }
      };

      // Apply filters and update filtered data
      for (let i = 0; i < windData.hourly.time.length; i++) {
        const windSpeed = windData.hourly.wind_speed_10m[i];
        const windDirection = windData.hourly.wind_direction_10m[i];
        const waveHeight = waveData.hourly.wave_height[i];

        if (windSpeed >= windMinValue && windSpeed <= windMaxValue &&
            waveHeight >= waveMinValue && waveHeight <= waveMaxValue) {
          this.filteredWindData.hourly.time.push(windData.hourly.time[i]);
          this.filteredWindData.hourly.wind_speed_10m.push(windSpeed);
          this.filteredWindData.hourly.wind_direction_10m.push(windDirection);
          this.filteredWaveData.hourly.time.push(waveData.hourly.time[i]);
          this.filteredWaveData.hourly.wave_height.push(waveHeight);
        }
      }

      // Update the chart with filtered data
      this.chartService.updateChart(this.filteredWindData, this.filteredWaveData);
      this.chartService.filterChartOption = this.chartService.chartOption;
      console.log(this.filteredWaveData);
      console.log(this.filteredWindData);
    }
  }

}
