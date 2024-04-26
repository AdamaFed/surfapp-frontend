import {Component, inject, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Event} from "../model/Event";
import {EventService} from "../service/event.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit{
events: Event[] = [];
eventService = inject(EventService);
  newEventForm = this.formBuilder.group({
    name: '',
    description: '',
    date: ''
  });

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe((result:any) =>
    this.events=result);
  }

  onSubmit() {
    this.eventService.addEvent({
      name: this.newEventForm.value.name ?? '',
      description: this.newEventForm.value.description ?? '',
      date: new Date(this.newEventForm.value.date ?? '')
      }
    ).subscribe(result =>
    console.log(result));
    this.newEventForm.reset();
  }
}
