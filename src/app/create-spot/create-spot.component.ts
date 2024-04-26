import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Spot} from "../model/Spot";
import {LocationService} from "../service/location.service";
import {SpotService} from "../service/spot.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-create-spot',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './create-spot.component.html',
  styleUrl: './create-spot.component.css'
})
export class CreateSpotComponent implements OnInit{

  spots: Spot[] = [];
  mapUrl: SafeResourceUrl | null = null;

  updateMapUrl(latitude: number, longitude: number, zoom: number = 11): void {
    const apiKey = 'AIzaSyCjL2Nv-wIjIV5jtXSYhKtZgY68EDW38aY'; // Replace with your API key
    const unsafeUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=${zoom}&maptype=satellite`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }

  newSpotForm = this.formBuilder.group({
    name: '',
    latitude: 0,
    longitude: 0,
    facing: 0
  });

  constructor(private formBuilder: FormBuilder,
              private locationService: LocationService,
              private spotService: SpotService,
              private sanitizer: DomSanitizer) {
    this.calculateDegrees();
    this.calculateDegreeLabels();
  }
  ngOnInit(): void {
    this.spotService.getAllSpots().subscribe(result =>
    this.spots = result);
  }
  getLongLat() {
    let name = this.newSpotForm.value.name;
    console.log(this.newSpotForm.value.name);
    return this.locationService.getLongLat({
      name: this.newSpotForm.value.name ?? '',
    latitude: 0,
    longitude: 0,
      facing: Number(this.newSpotForm.value.facing) ?? ''}).subscribe((spot: any) => {
      console.log(spot);
      this.newSpotForm.setValue({
        name: name!,
        longitude: Number(spot[0].lon) ?? '',
        latitude: Number(spot[0].lat) ?? '',
        facing: Number(this.newSpotForm.value.facing) ?? ''});
      this.updateMapUrl(spot[0].lat,spot[0].lon);
    });

  }

  onSubmit() {
    this.spotService.addSpot({
      name: this.newSpotForm.value.name ?? '',
      latitude: Number(this.newSpotForm.value.latitude) ?? '',
      longitude: Number(this.newSpotForm.value.longitude) ?? '',
      facing: Number(this.newSpotForm.value.facing) ?? ''}).subscribe(result =>
    console.log(result));
    this.newSpotForm.reset();
  }


  degrees: number[] = [];
  degreeLabels: number[] = [];



  private calculateDegrees() {
    for (let i = 0; i < 360; i += 10) {
      this.degrees.push(i);
    }
  }

  private calculateDegreeLabels() {
    for (let i = 0; i < 360; i += 45) {
      this.degreeLabels.push(i);
    }
  }

  lineX1(degree: number): number {
    const radius = 120;
    const angle = (degree - 90) * (Math.PI / 180);
    return 150 + (radius - 10) * Math.cos(angle);
  }

  lineY1(degree: number): number {
    const radius = 120;
    const angle = (degree - 90) * (Math.PI / 180);
    return 150 + (radius - 10) * Math.sin(angle);
  }

  lineX2(degree: number): number {
    const radius = 120;
    const angle = (degree - 90) * (Math.PI / 180);
    return 150 + radius * Math.cos(angle);
  }

  lineY2(degree: number): number {
    const radius = 120;
    const angle = (degree - 90) * (Math.PI / 180);
    return 150 + radius * Math.sin(angle);
  }

  textX(degree: number): number {
    const radius = 120;
    const angle = (degree - 90) * (Math.PI / 180);
    return 150 + (radius + 20) * Math.cos(angle);
  }

  textY(degree: number): number {
    const radius = 120;
    const angle = (degree - 90) * (Math.PI / 180);
    return 150 + (radius + 20) * Math.sin(angle);
  }


}
