import {Component, inject, OnInit} from '@angular/core';
import {FeedbackService} from "../../service/feedback.service";
import {Comment} from "../../model/Comment";
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Condition} from "../../model/Condition";
import {WeatherService} from "../../service/weather.service";
import {WindData} from "../../model/WindData";
import {SpotService} from "../../service/spot.service";
import {Spot} from "../../model/Spot";


@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    FormsModule
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit{
  spotService = inject(SpotService);
  feedbackService= inject(FeedbackService);
  forecastService = inject(WeatherService);
  comments: Comment[] = [];
  filteredComments: Comment[] = [];
  conditions: Condition[] = [];
  filteredConditions: Condition[] = [];
  windData: WindData | null = null;
  spots: Spot[] = [];
  currentCondition: Condition = {
    windDirection: 0,
    windSpeed: 0,
    rating: 0,
    spotId: 0,
  };

  // KOMPASS
  compassDirections = ['E', 'SE', 'S', 'SW', 'W', 'NW','N', 'NE'];
  centerX = 200;
  centerY = 200;

  //FORMS
  newFeedbackForm = this.formBuilder.group({
    winddirection: 0,
    windspeed: 0,
    rating: 0,
    spotId: 0,
    comment: ''
  });

  newFilterForm= this.formBuilder.group({
    spot: 0
  });
  constructor(private formBuilder: FormBuilder) {
  }



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

  calculateLabelX(direction: string): number {
    const labelRadius = 170;
    const angle = this.getCompassDirectionAngle(direction);
    return this.centerX + labelRadius * Math.cos(angle);
  }

  calculateLabelY(direction: string): number {
    const labelRadius = 170;
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
    return this.centerX + condition.windSpeed*4 * Math.cos((condition.windDirection - 90) * (Math.PI / 180));
  }

  calculateY2(condition: Condition): number {
    // Berechne die Y2-Koordinate basierend auf der Windrichtung und Länge
    return this.centerY + condition.windSpeed*4 * Math.sin((condition.windDirection - 90) * (Math.PI / 180));
  }

  colorOf(condition: Condition): string {
    if (condition.rating <= 3) {
      return "red";
    } else if (condition.rating <= 7) {
      return "yellow";
    } else {
      return "green";
    }
  }



  ngOnInit(): void {
    this.feedbackService.getAllComments().subscribe((result: any) =>
    this.comments = result
    );
    this.feedbackService.getAllConditions().subscribe((result: any) =>
    this.conditions = result
    );
    this.spotService.getAllSpots().subscribe(result =>
    this.spots = result);
    // this.filteredConditions = this.conditions;
  }
  getWindData(longitude: number, latitude: number) {

        return this.forecastService.fetchWindData(
        latitude,longitude,this.formatDate(Date.now()),this.formatDate(Date.now()))



  }
  onSubmit() {
    console.log("spot",this.newFeedbackForm.value.spotId);
    let spotId = Number(this.newFeedbackForm.value.spotId);
    let rating = Number(this.newFeedbackForm.value.rating);
    let comment = this.newFeedbackForm.value.comment;
    console.log("comment",comment);
    let spot = this.spots.find(spot => spot.id === spotId);
    this.getWindData(spot!.longitude,spot!.latitude).subscribe((windData: WindData) => {
      console.log('Winddaten:', windData);
      this.currentCondition =  {
        windDirection: windData.hourly.wind_direction_10m[0] ?? '',
        windSpeed: windData.hourly.wind_speed_10m[0] ?? '',
        rating: rating,
        spotId: spotId,
      }

      console.log("condition",this.currentCondition);
      this.feedbackService.newCondition(
          Number(this.currentCondition.spotId) ?? '',
          Number(this.currentCondition.windDirection) ?? '',
          Number(this.currentCondition.windSpeed) ?? '',
          Number(this.currentCondition.rating) ?? '')
          .subscribe(result => console.log(result));
      if (this.newFeedbackForm.value.comment != '') {
        this.feedbackService.newComment(
            Number(this.currentCondition.spotId) ?? '',
            comment ?? '')
            .subscribe(result => console.log(result));
      }

    });

    this.newFeedbackForm.reset();
  }


  filterBySpotId() {
    let spotId = Number(this.newFilterForm.value.spot) ?? '';
    console.log(spotId);
    this.filteredConditions = this.conditions.filter((e) => e.spotId == spotId);
    this.filteredComments = this.comments.filter((e) => e.spotId == spotId);
    console.log(this.filteredConditions);
  }
}
