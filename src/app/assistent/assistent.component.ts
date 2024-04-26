import {Component, inject, OnInit} from '@angular/core';
import {MatSliderModule} from "@angular/material/slider";
import {FormBuilder, FormsModule} from "@angular/forms";
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
import {NgForOf, NgIf} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {TideData} from "../model/TideData";
import {Observable} from "rxjs";
import {EChartsOption} from "echarts";
import {NgxEchartsDirective} from "ngx-echarts";
import {
  CustomSeriesRenderItemParams,
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemReturn, TitleOption
} from 'echarts/types/dist/shared';
import {forkJoin} from "rxjs";
import echarts from 'echarts/types/dist/echarts';
import {EChartModel} from "../model/EChartModel";
import {FeedbackService} from "../service/feedback.service";
import {Condition} from "../model/Condition";
import {RouterLink} from "@angular/router";


@Component({
  selector: 'app-assistent',
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
    RouterLink,
  ],
  templateUrl: './assistent.component.html',
  styleUrl: './assistent.component.css'
})
export class AssistentComponent implements OnInit {

  startDate: string = '';
  endDate: string = '';


  tideData: TideData[] = [];


  charts: EChartsOption[] = [];
  weekCharts: EChartModel[][] = [];



  mainChartOption: EChartsOption = {};
  initMainChartOpts = {
    renderer: 'svg',
    // width: 'auto',
    // height: 'auto'
    // width: 300,
    // height: 200,
  };
  filterChartOption: EChartsOption = {};
  initFilterChartOpts = {
    renderer: 'svg',
    width: 200,
    height: 300,
  };


  windData: WindData | null = null;
  filteredWindData: WindData | null = null;
  waveData: WaveData | null = null;
  filteredWaveData: WaveData | null = null;
  windSpeedColor = 'rgba(252,100,225,0.98)';
  waveHeightColor = 'rgb(97,234,193)';

  locationService = inject(LocationService);

  compassDirections = ['E', 'SE', 'S', 'SW', 'W', 'NW','N', 'NE'];
  sizeUserCircle = 400;
  centerX = 100;
  centerY = 100;
  feedbackService = inject(FeedbackService);
  conditions: Condition[] = [];

  filterBySpotId(spotId: number | undefined) {
    return this.conditions.filter((e) => e.spotId == spotId);
  }
  calculateX2(condition: Condition) {return this.feedbackService.calculateX2(condition)  }
  calculateY2(condition: Condition) {return this.feedbackService.calculateY2(condition)  }
  colorOf(condition: Condition) { return this.feedbackService.colorOf(condition) }
  calculateLabelX(direction: string) {return this.feedbackService.calculateLabelX(direction)  }
  calculateLabelY(direction: string) { return this.feedbackService.calculateLabelY(direction)

  }

  // spotService = inject(SpotService);
  location: Spot;
  spots: Spot[] = [];
  filteredSpots: Spot[] = [];
  isSidenavOpened = true; // Sidenav ist anfangs geöffnet
  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  ngOnInit(): void {

    this.location = {name: "Hamburg", latitude: 53.550341, longitude: 10.000654, facing: 0};
    this.feedbackService.getAllConditions().subscribe(result =>
    this.conditions = result)
    this.start();


  }
  days = 7;
  start() {
    this.spotService.getAllSpots().subscribe(async (spots: any) => {
      // console.log("Outcome request", spots);
      this.spots = spots;
      this.filteredSpots = this.filterSpotsByDistance(this.spots);
      // console.log(this.filteredSpots);
      this.days = Number(new Date(this.formatDate(this.dateMaxValue)).toLocaleDateString('en-US', { day: 'numeric'})) - Number(new Date(this.formatDate(this.dateMinValue)).toLocaleDateString('en-US', { day: 'numeric'}));
      this.dateRange = this.createDateRange(this.days);
      // console.log("DAYS IS", this.days)
      for(let i=0; i<this.days;i++) {
        this.weekCharts[i]=[];
        for (let spot of this.filteredSpots) {
          this.fetchWeatherData(spot,i);
        }
      }
    });
  }

  filterSpotsByDistance(spots: Spot[]) {
    let filteredSpots : Spot[] = [];
    for(let spot of spots){
      // console.log("Distance:" + this.location.name + " to " + spot.name + " = " + this.getDistance(this.location,spot));
      if (Number(this.getDistance(this.location,spot)) < this.radiusValue) {
        filteredSpots.push(spot);
      }
    }
    return filteredSpots;
  }

  updateChart(windData: WindData, waveData: WaveData, chartOption: EChartsOption ) {

    if (windData && windData.hourly && waveData && waveData.hourly) {
      const timeData = windData.hourly.time;
      const windSpeedData = windData.hourly.wind_speed_10m;
      const waveHeightData = waveData.hourly.wave_height;
      const windDirectionData = windData.hourly.wind_direction_10m;

      const arrowSize = 18; // Define the size of the arrow
      const renderArrow: echarts.CustomSeriesOption['renderItem'] = (param, api) => {
        const windDirection = windData?.hourly?.wind_direction_10m[param.dataIndex] ?? 0;
        const point = api.coord([timeData[param.dataIndex],
          windSpeedData[param.dataIndex]

        ]);
        let rotation = ((windDirection + 90) % 360) * -(Math.PI / 180);

        return {
          type: 'path',
          shape: {
            pathData: 'M31 16l-15-15v9h-26v12h26v9z', // Define the arrow shape
            x: -arrowSize / 2,
            y: -arrowSize / 2,
            width: arrowSize,
            height: arrowSize
          },
          rotation: rotation, // Convert degrees to radians,
          position: point,
          style: api.style({
            stroke: '#555',
            lineWidth: 0
          })
        };
      };

      // let myChart = echarts.init(document.getElementById(mainChart));

      chartOption = {
        title: {
          text: 'Location + Date/Time',
          textStyle: {
            fontSize: 14, // Set your desired font size here
            color: 'white'
          },

        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params: any) {
            const dateTime = new Date(params[0].axisValueLabel);

            const padZero = (num: any) => (num < 10 ? `0${num}` : num);
            const formattedDate = `${padZero(dateTime.getDate())} ${dateTime.toLocaleString('en-US', { month: 'short' })}, ${padZero(dateTime.getHours())}h`;

            // let dateAndTime = params[0].axisValueLabel; // Datum und Uhrzeit
            let windSpeed = params.find((p: any) => p.seriesName === 'Wind Speed');
            let windDirection = params.find((p: any) => p.seriesType === 'custom');
            let waveHeight = params.find((p: any) => p.seriesName === 'Wave Height');

            let result = formattedDate;
            if (windSpeed) {
              result += `<br/><span style="color: ${windSpeed.color}">●</span> Wind Speed: ${windSpeed.data} kts`;
            }
            if (windDirection) {
              let windDirectionValue = windDirectionData[params[0].dataIndex];
              result += `<br/><span style="color: blue">●</span> Wind Direction: ${windDirectionValue} °`;
            }
            if (waveHeight) {
              result += `<br/><span style="color: ${waveHeight.color}">●</span> Wave Height: ${waveHeight.data} m`;
            }

            return result;
          }
        },
        xAxis: {
          type: 'category',
          data: timeData,
          axisLabel: {
            formatter: (value: string) => {
              // Format the display of date-time labels as needed
              return value; // Placeholder, adjust date formatting as necessary
            }
          }
        },
        yAxis: [{
          type: 'value',
          name: 'Wind Speed (knots)',
          nameLocation: 'middle',
          nameGap: 35,
          axisLine: {
            lineStyle: {
              color: this.windSpeedColor
            }
          },


        },
          {
            name: 'Wave height',
            nameLocation: 'middle',
            nameGap: 35,
            max: 10,
            axisLine: {
              lineStyle: {
                color: this.waveHeightColor
              }
            },
            splitLine: {show: false}
          },
          {
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {show: false},
            splitLine: {show: false}

          }],
        series: [
          {
            name: 'Wind Speed',
            yAxisIndex: 0,
            type: 'line',
            lineStyle: {
              color: this.windSpeedColor
            },
            itemStyle: {
              color: this.windSpeedColor
            },
            data: windSpeedData,
            smooth: true
          },
          {
            type: 'custom',
            renderItem: renderArrow,
            data: timeData.map((_, idx) => [
              timeData[idx],
              windSpeedData[idx]

            ]),
            z: 100
          },
          {
            name: 'Wave Height',
            yAxisIndex: 1,
            type: 'line',
            lineStyle: {
              color: this.waveHeightColor
            },
            itemStyle: {
              color: this.waveHeightColor
            },
            data: waveHeightData,
            smooth: true
          },

        ]
      };
      return chartOption;
    }
    return null;
  }

  constructor(
    private formBuilder: FormBuilder,
    private weatherService: WeatherService,
    private spotService: SpotService,
  ) {
    this.location = {name: "Hamburg", latitude: 0, longitude: 0, facing: 0};
  }

  fetchWeatherData(spot: Spot, i: number) {
    // Format slider values
    const formattedStartDate = this.formatDate(this.dateMinValue+i*86400000); //+i*milliseconds for one day
    const formattedEndDate = this.formatDate(this.dateMinValue+i*86400000);    // +(i+1)*milliseconds for one day
    // Add hour values
    const startHour = `${formattedStartDate}T${this.hourMinValue < 10 ? '0' : ''}${this.hourMinValue}:00`;
    const endHour = `${formattedEndDate}T${this.hourMaxValue <= 10 ? '0' : ''}${this.hourMaxValue-1}:00`;
    // Geodata
    const latitude = spot.latitude;
    const longitude = spot.longitude;
    // API fetches
    const windDataObservable = this.weatherService.fetchWindData(latitude, longitude, startHour, endHour);
    const waveDataObservable = this.weatherService.fetchWaveData(latitude, longitude, startHour, endHour);
    const tideDataObservable = this.weatherService.fetchTideData2(latitude, longitude, formattedStartDate, formattedEndDate);

    forkJoin([windDataObservable, waveDataObservable, tideDataObservable]).subscribe(([windData, waveData, tideData]) => {
      this.windData = windData;
      this.waveData = waveData;
      const formatedTideData = this.transformTideResponse(tideData);
      console.log(formatedTideData);
      // const formatedTideData : TideData[] = [];

      let newChartOption = this.filterData2(windData, waveData, formatedTideData, spot, i);
    });


  }

  filterData2(windData: WindData, waveData: WaveData, tideData: TideData[], spot: Spot, j: number) {

    if (windData && windData.hourly && waveData && waveData.hourly) {

      // Initialize filtered data
      let filteredWindData: WindData = {
        ...windData, hourly: {
          time: [], wind_speed_10m: [], wind_direction_10m: [],
          wind_gusts_10m: []
        }
      };
      let filteredWaveData: WaveData = {
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

        if (
          this.hasCorrectAngle(windDirection, spot.facing) &&
          this.hasCorrectTide(waveData, tideData, i) &&
          this.hasCorrectTime(waveData.hourly.time[i]) &&
          windSpeed >= this.windMinValue && windSpeed <= this.windMaxValue &&
          waveHeight >= this.waveMinValue && waveHeight <= this.waveMaxValue) {

          filteredWindData.hourly.time.push(windData.hourly.time[i]);
          filteredWindData.hourly.wind_speed_10m.push(windSpeed);
          filteredWindData.hourly.wind_direction_10m.push(windDirection);
          filteredWaveData.hourly.time.push(waveData.hourly.time[i]);
          filteredWaveData.hourly.wave_height.push(waveHeight);
        }
      }

      if ( filteredWindData.hourly.time.length != 0) {

        // Update the chart with filtered data
        let chartOption: EChartsOption = {};

        let newChartOption = this.updateChart(filteredWindData, filteredWaveData, chartOption);
        let title: TitleOption = newChartOption!.title as TitleOption;
        title.text = spot.name + " - " + new Date(filteredWindData.hourly.time[0]).
          toLocaleDateString('en-US', { month: 'short', day: 'numeric'});

        this.weekCharts[j].push({
            spotId: spot.id,
            chartOption: newChartOption!,
            date: new Date(filteredWindData.hourly.time[0])
              .toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'})
          });

        return newChartOption;
      }
    }
    return null;
  }

  transformTideResponse(response: any): TideData[] {
    let transformedData: TideData[] = [];
    response.data.forEach((parameterData: any) => {
      parameterData.coordinates.forEach((coordinateData: any) => {
        coordinateData.dates.forEach((dateData: any) => {
          let tideEntry = transformedData.find(entry => entry.date === dateData.date);

          if (!tideEntry) {
            tideEntry = {
              date: dateData.date,
              firstLowTide: '',
              firstHighTide: '',
              secondLowTide: '',
              secondHighTide: '',
              tidalAmplitude: 0
            };
            transformedData.push(tideEntry);
          }

          switch (parameterData.parameter) {
            case "first_low_tide:sql":
              tideEntry.firstLowTide = dateData.value;
              break;
            case "first_high_tide:sql":
              tideEntry.firstHighTide = dateData.value;
              break;
            case "second_low_tide:sql":
              tideEntry.secondLowTide = dateData.value;
              break;
            case "second_high_tide:sql":
              tideEntry.secondHighTide = dateData.value;
              break;
            case "tidal_amplitude:cm":
              tideEntry.tidalAmplitude = parseFloat(dateData.value);
              break;
          }
        });
      });
    });

    return transformedData;
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


  newLocationForm = this.formBuilder.group({
    name: '',
    lat: 0,
    long: 0,
    facing: 0
  });

  beginnersPreferencesActive: boolean = false;

  onSliderChange() {
    console.log('Slider changed. Values:', this.windMinValue, this.windMaxValue, this.waveMinValue, this.waveMaxValue);

    if (this.windMinValue !== 18 || this.windMaxValue !== 25 || this.waveMinValue !== 0 || this.waveMaxValue !== 1) {
      this.beginnersPreferencesActive = false;
    }



  }

  setBeginnersPreferences(event: MatSlideToggleChange) {
    this.beginnersPreferencesActive = event.checked;
    if (event.checked) {
      // Set the sliders for beginners
      this.windMinValue = 18;
      this.windMaxValue = 25;
      this.waveMinValue = 0;
      this.waveMaxValue = 1;
      this.highTidePreferencesActive = event.checked;
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
    hideLimitLabels: true,
    animate: false,
    showOuterSelectionBars: true,
    translate: (value: number): string => {
      return value + ' m';
    },
  };

  // Radius Slider
  radiusValue: number = 500;
  radiusOptions: Options = {
    floor: 0,
    ceil: 5000,
    hideLimitLabels: true,
    animate: false,
    showOuterSelectionBars: true,
    translate: (value: number): string => {
      return value + ' km';
    },
  };

  // Date range slider
  currentDate: Date = new Date(); // Current date
  dateRange: Date[] = this.createDateRange(7);
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

  createDateRange(days: number): Date[] {
    const dates: Date[] = [];
    let startDate = new Date(); // Today's date
    let endDate = new Date(); // Also starting from today
    endDate.setDate(endDate.getDate() + days); // Setting end date to 6 days after today

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

// Time Slider
  hourMinValue: number = 0;
  hourMaxValue: number = 23;
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


  getLongLat() {
    return this.locationService.getLongLat(this.location).subscribe((spot: any) => {
      this.location.latitude = spot[0].lat;

      this.location.longitude = spot[0].lon;
      console.log(spot);
    });
  }

  getDistance(spotFrom: Spot, spotTo: Spot) {
    return this.locationService.getDistanceOf(spotFrom, spotTo);
  }


  onSubmit() {
    this.location.name = this.newLocationForm.value.name ?? '';
    this.getLongLat();
    this.newLocationForm.reset();
  }

  getCurrentPosition(event: any) {
    if (event.checked) {
      this.locationService.getCurrentPosition().then(result =>
        this.location = result);

    }
  }

  private hasCorrectAngle(windDirection: number, spotfacing: number): boolean {
    windDirection = (windDirection + 360) % 360;
    spotfacing = (spotfacing + 360) % 360;

    let angleDifference = Math.abs(windDirection - spotfacing);
    angleDifference = Math.min(360 - angleDifference, angleDifference);

    return angleDifference < 90;
  }
  highTidePreferencesActive: boolean = false;

  setTidePreferences(event: MatSlideToggleChange) {
    this.highTidePreferencesActive = event.checked;

  }


  range: number = 3;
  rangeOptions: Options = {
    floor: 0,
    ceil: 6,
    hideLimitLabels: true,
    animate: false,
    showOuterSelectionBars: true,
    translate: (value: number): string => {
      return value + ' h';
    },
  };

  private hasCorrectTide(waveData: WaveData, tideData: TideData[], i: number) {
    let range = this.range;
    let firstTide = '';
    let secondTide = '';
    if (this.highTidePreferencesActive) {

       firstTide = tideData[i].firstHighTide;
       secondTide = tideData[i].secondHighTide;
    } else {

      firstTide = tideData[i].firstLowTide;
      secondTide = tideData[i].secondLowTide;
    }

    if (firstTide === "-666") { return true}


    return ((new Date(waveData.hourly.time[i]).getHours() <= new Date(firstTide).getHours() + range &&
        new Date(waveData.hourly.time[i]).getHours() >= new Date(firstTide).getHours() - range) ||
      (new Date(waveData.hourly.time[i]).getHours() <= new Date(secondTide).getHours() + range &&
        new Date(waveData.hourly.time[i]).getHours() >= new Date(secondTide).getHours() - range));
  }


  private hasCorrectTime(dateTime: string) {
    return new Date(dateTime).getHours() >= new Date("2024-01-05T".concat(((this.hourMinValue < 10) ? "0" : "" ) + this.hourMinValue.toString()).concat(":00")).getHours()  &&    // complex time definition
      new Date(dateTime).getHours() <= new Date("2024-01-05T".concat(((this.hourMaxValue < 10) ? "0" : "" ) + this.hourMaxValue.toString()).concat(":00")).getHours();
  }

  filterDataOnClick() {
    this.charts.splice(0,this.charts.length);
    this.start();
    // console.log("Onclick array",this.charts);
    // for(let i=0; i<2;i++) {
    //   this.weekCharts[i] = [];
    //   for (let spot of this.spots) {
    //     this.fetchWeatherData(spot,i);
    //   }
    // }
  }

  private hasCorrectWeekDay(dateTime: string, wantedDate: string, i: number) {
    // console.log("has correct week day: wanted: ",new Date(wantedDate).getDay(), "with i = ", i);
    // console.log("has correct week day: daytime: ",new Date(dateTime).getDay(), "with i = ", i);
    return new Date(dateTime).getDay() === new Date(wantedDate).getDay()+i;
  }



}
