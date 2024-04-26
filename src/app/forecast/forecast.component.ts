import {Component, OnInit} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule
} from "@angular/forms";
import {
    ForecastService
} from "../service/forecast.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-forecast',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.css'
})
export class ForecastComponent implements OnInit {
    searchForm!: FormGroup;

    constructor(private formBuilder: FormBuilder, private forecastService: ForecastService) {
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.searchForm = this.formBuilder.group({
            location: '',
            coordinates: '',
            startTime: '',
            endTime: '',
            windSpeed: '',
            waveHeight: ''
        });
    }

    onSubmit() {
        const { coordinates, startTime, endTime, windSpeed, waveHeight } = this.searchForm.value;

        const [latitude, longitude] = coordinates.split(',');

        const marineObservable = this.forecastService.getMarineForecast(Number(latitude), Number(longitude), startTime, endTime);
        const windObservable = this.forecastService.getWindForecast(Number(latitude), Number(longitude), startTime, endTime);

        const waveHeightThreshold: number = parseFloat(waveHeight) ?? 0;
        const windSpeedThreshold: number = parseFloat(windSpeed) ?? 0;

        forkJoin([marineObservable, windObservable]).subscribe(
            ([marineForecasts, windForecasts]) => {

                console.log('Original Marine Forecasts:', marineForecasts.hourly);
                console.log('Original Wind Forecasts:', windForecasts.hourly);

                // const filteredMarineForecasts = this.forecastService.filterWaveHeight(marineForecasts.hourly, waveHeightThreshold);
                // const filteredWindForecasts = this.forecastService.filterWindSpeed(windForecasts.hourly, windSpeedThreshold);
                //
                // console.log('Filtered Marine Forecasts:', filteredMarineForecasts);
                // console.log('Filtered Wind Forecasts:', filteredWindForecasts);

              // Inside ForecastComponent's subscribe method
              const filteredMarineForecasts = this.forecastService.filterWaveHeight(marineForecasts.hourly, waveHeightThreshold);
              const filteredWindForecasts = this.forecastService.filterWindSpeed(windForecasts.hourly, windSpeedThreshold);

              console.log('Filtered Marine Forecasts:', filteredMarineForecasts);
              console.log('Filtered Wind Forecasts:', filteredWindForecasts);


            },
            error => {
                console.error('Error fetching forecasts:', error);
            }
        );
    }
}
