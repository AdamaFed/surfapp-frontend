import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {MatSliderModule} from "@angular/material/slider";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleChange, MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {LocationService} from "../service/location.service";
import {SpotService} from "../service/spot.service";
import {Spot} from "../model/Spot";
import {NgxSliderModule, Options} from 'ngx-slider-v2';
import {WeatherService} from '../service/weather.service';
import {WaveData} from "../model/WaveData";
import {WindData} from "../model/WindData";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {TideData} from "../model/TideData";
import {async, filter, map, Observable, startWith} from "rxjs";
import {EChartsOption} from "echarts";
import {NgxEchartsDirective} from "ngx-echarts";
import {forkJoin} from "rxjs";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ChartService} from "../service/chart.service";
import {ChatComponent} from "../chat/chat.component";

@Component({
    selector: 'app-spot-forecast',
    standalone: true,
  imports: [
    MatSliderModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatInputModule,
    MatDatepickerModule,
    NgxSliderModule,
    NgForOf,
    NgIf,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    NgxEchartsDirective,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    ChatComponent,
  ],
    templateUrl: './spot-forecast.component.html',
    styleUrl: './spot-forecast.component.css'
})
export class SpotForecastComponent implements OnInit {

    windData: WindData | null = null;
    filteredWindData: WindData | null = null;
    waveData: WaveData | null = null;
    filteredWaveData: WaveData | null = null;
    tideData: TideData[] = [];

    // Vars for spot filter and select field
    spots: Spot[] = [];
    spotControl = new FormControl('');
    filteredSpots!: Observable<Spot[]>;

    clearSpotControl() {
        this.spotControl.setValue('');
    }

    // Chart options
    initChartOpts = {
        renderer: 'svg',
        width: '1500px',
        height: '400px',
    };
    mainChartOption: EChartsOption = {};
    filterChartOption: EChartsOption = {};


    constructor(
        private formBuilder: FormBuilder,
        private weatherService: WeatherService,
        private spotService: SpotService,
        private sanitizer: DomSanitizer,
        private chartService: ChartService,
    ) {
        this.spotService.getAllSpots().subscribe((spots: any) => {
            console.log("Outcome request", spots);
            this.spots = spots;
        });
    }


    isSidenavOpened = true;
    toggleSidenav() {
        this.isSidenavOpened = !this.isSidenavOpened;
    }

    private _filterSpots(value: string): Spot[] {
        const filterValue = value.toLowerCase();
        return this.spots.filter(spot => spot.name.toLowerCase().startsWith(filterValue));
    }
    selSpot: any;

    ngOnInit(): void {
        // Adapt filteredSpots array
        this.filteredSpots = this.spotControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterSpots(value!))
        );

        // Update weatherData and Map after selecting spot
        this.spotControl.valueChanges.subscribe(selectedSpotName => {
            const selectedSpot = this.spots.find(spot => spot.name === selectedSpotName);
            this.selSpot = selectedSpot;
            if (selectedSpot) {
                this.fetchWeatherData(selectedSpot.latitude, selectedSpot.longitude);
                this.updateMapUrl(selectedSpot.latitude, selectedSpot.longitude);
            }
        });
    }

    mapUrl: SafeResourceUrl | null = null;
    updateMapUrl(latitude: number, longitude: number, zoom: number = 11): void {
        const apiKey = 'AIzaSyCjL2Nv-wIjIV5jtXSYhKtZgY68EDW38aY'; // Replace with your API key
        const unsafeUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=${zoom}&maptype=satellite`;
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    }

    fetchWeatherData(latitude: number, longitude: number) {
        //
        // // Format slider values
        const formattedStartDate = this.formatDate(this.dateMinValue);
        const formattedEndDate = this.formatDate(this.dateMaxValue);
        // // Add hour values
        const startHour = `${formattedStartDate}T${this.hourMinValue < 10 ? '0' : ''}${this.hourMinValue}:00`;
        const endHour = `${formattedEndDate}T${this.hourMaxValue <= 10 ? '0' : ''}${this.hourMaxValue - 1}:00`;

        const windDataObservable = this.weatherService.fetchWindData(latitude, longitude, startHour, endHour);
        const waveDataObservable = this.weatherService.fetchWaveData(latitude, longitude, startHour, endHour);

        forkJoin([windDataObservable, waveDataObservable]).subscribe(([windData, waveData]) => {
            console.log('Wind data:', windData);
            console.log('Wave data:', waveData);

            this.windData = windData;
            this.waveData = waveData;

            this.filterData(); // Filter data based on current slider values

            this.mainChartOption = this.chartService.updateChart(this.windData, this.waveData, this.mainChartOption)!;
        });
    }

    private hasCorrectAngle(windDirection: number, spotfacing: number): boolean {
        windDirection = (windDirection + 360) % 360;
        spotfacing = (spotfacing + 360) % 360;

        let angleDifference = Math.abs(windDirection - spotfacing);
        angleDifference = Math.min(360 - angleDifference, angleDifference);

        return angleDifference < 180;
    }
    hasFilteredData(): boolean {
        return !!this.windData && this.getFilteredDataForTable().length > 0;
    }
    filterData() {
        if (this.windData && this.windData.hourly && this.waveData && this.waveData.hourly) {
            // Initialize filtered data
            this.filteredWindData = {
                ...this.windData, hourly: {
                    time: [], wind_speed_10m: [], wind_direction_10m: [],
                    wind_gusts_10m: []
                }
            };
            this.filteredWaveData = {
                ...this.waveData, hourly: {
                    time: [], wave_height: [],
                    wave_direction: []
                }
            };

            // Apply filters and update filtered data
            for (let i = 0; i < this.windData.hourly.time.length; i++) {
                const windSpeed = this.windData.hourly.wind_speed_10m[i];
                const windDirection = this.windData.hourly.wind_direction_10m[i];
                const waveHeight = this.waveData.hourly.wave_height[i];

                if (windSpeed >= this.windMinValue && windSpeed <= this.windMaxValue &&
                    waveHeight >= this.waveMinValue && waveHeight <= this.waveMaxValue &&
                this.hasCorrectAngle(windDirection, this.selSpot.facing)
                ) {
                    this.filteredWindData.hourly.time.push(this.windData.hourly.time[i]);
                    this.filteredWindData.hourly.wind_speed_10m.push(windSpeed);
                    this.filteredWindData.hourly.wind_direction_10m.push(windDirection);
                    this.filteredWaveData.hourly.time.push(this.waveData.hourly.time[i]);
                    this.filteredWaveData.hourly.wave_height.push(waveHeight);
                }
            }

            // Update the chart with filtered data
            this.filterChartOption = this.chartService.updateChart(this.filteredWindData, this.filteredWaveData, this.mainChartOption)!;
            console.log(this.filteredWaveData);
            console.log(this.filteredWindData);
        }
    }

    getFormattedDataForTable(): any[] {
        let tableData = [];

        if (this.windData?.hourly && this.waveData?.hourly) {
            let windHourly = this.windData.hourly;
            let waveHourly = this.waveData.hourly;

            for (let i = 0; i < windHourly.time.length; i++) {
                let row = {
                    time: windHourly.time[i],
                    windSpeed: windHourly.wind_speed_10m[i],
                    windDirection: windHourly.wind_direction_10m[i],
                    waveHeight: waveHourly.wave_height[i],
                    waveDirection: waveHourly.wave_direction[i]
                };
                tableData.push(row);
            }
        }

        return tableData;
    }

    getFilteredDataForTable(): any[] {
        return this.getFormattedDataForTable().filter(data => {
            return data.waveHeight <= this.waveMaxValue &&
                data.waveHeight >= this.waveMinValue &&
                data.windSpeed >= this.windMinValue &&
                data.windSpeed <= this.windMaxValue;
        });
    }


    beginnersPreferencesActive: boolean = false;
    onSliderChange() {
        if (this.windMinValue !== 18 || this.windMaxValue !== 25 || this.waveMinValue !== 0 || this.waveMaxValue !== 1) {
            this.beginnersPreferencesActive = false;
        }
        this.filterData();
        console.log('Slider changed. Values:', this.windMinValue, this.windMaxValue, this.waveMinValue, this.waveMaxValue);
    }

    setBeginnersPreferences(event: MatSlideToggleChange) {
        this.beginnersPreferencesActive = event.checked;
        if (event.checked) {
            // Set the sliders for beginners
            this.windMinValue = 18;
            this.windMaxValue = 25;
            this.waveMinValue = 0;
            this.waveMaxValue = 1;
            this.filterData()
        }
    }


    // Wind Slider
    windMinValue: number = 5;
    windMaxValue: number = 40;
    windOptions: Options = {
        floor: 5,
        ceil: 40,
        disabled: false,
        hideLimitLabels: true,
        animate: false,
        translate: (value: number): string => {
            return value + ' kts';
        },
    };

// Wave Slider
    waveMinValue: number = 0;
    waveMaxValue: number = 10;
    waveOptions: Options = {
        floor: 0,
        ceil: 10,
        step: 0.5,
        hideLimitLabels: true,
        animate: false,
        showOuterSelectionBars: true,
        translate: (value: number): string => {
            return value + ' m';
        },
    };

    // Radius Slider
    radiusValue: number = 0;
    radiusOptions: Options = {
        floor: 0,
        ceil: 500,
        hideLimitLabels: true,
        animate: false,
        showOuterSelectionBars: true,
        translate: (value: number): string => {
            return value + ' km';
        },
    };

    // Date range slider
    currentDate: Date = new Date(); // Current date
    dateRange: Date[] = this.createDateRange();
    value: number = this.currentDate.getTime(); // Set value to current date in milliseconds
    dateMinValue: number = this.currentDate.getTime(); // Start the first thumb at the current date
    dateMaxValue: number = this.dateRange[this.dateRange.length - 1].getTime(); // End of the range
    dateOptions: Options = {
        floor: 0,
        ceil: 7,
        hideLimitLabels: true,
        animate: false,
        tickStep: 7,
        tickValueStep: 0,
        stepsArray: this.dateRange.map((date: Date) => {
            return {value: date.getTime()};
        }),
        translate: (value: number): string => {
            const date = new Date(value);
            // Format the date as 'Day, Month Date' (e.g., 'Monday, June 15')
            return date.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});
        }
    };

    formatDate(dateInMilliseconds: number): string {
        const date = new Date(dateInMilliseconds);
        let month = '' + (date.getMonth() + 1), // In JS month begin at 0
            day = '' + date.getDate(),
            year = date.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    createDateRange(): Date[] {
        const dates: Date[] = [];
        let startDate = new Date(); // Today's date
        let endDate = new Date(); // Also starting from today
        endDate.setDate(endDate.getDate() + 7); // Setting end date to 6 days after today

        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }
        return dates;
    };

// Time Slider
    hourMinValue: number = 0;
    hourMaxValue: number = 24;
    hourOptions: Options = {
        floor: 0,
        ceil: 24,
        minRange: 1,
        hideLimitLabels: true,
        animate: false,
        showOuterSelectionBars: true,
        translate: (value: number): string => {
            return (value < 10 ? '0' : '') + value + ':00 h';
        },
    };

    protected readonly async = async;
    protected readonly filter = filter;
}
