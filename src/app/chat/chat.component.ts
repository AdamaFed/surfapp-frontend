import {Component, inject, OnInit} from '@angular/core';
import {ChatElement} from "../model/ChatElement";
import {ChatGptService} from "../service/chat-gpt.service";
import {NgForOf} from "@angular/common";
import {timestamp} from "rxjs";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{
  chatGptService = inject(ChatGptService);

  chat: ChatElement[] = [];
  newChatForm = this.formBuilder.group({
    content: ''
  });

  constructor(private formBuilder: FormBuilder) {
  }
  ngOnInit(): void {
    this.chat.push({content: 'Wie kann ich helfen?'});
  }


  onSubmit() {
    this.chat.push({content: "You:" + this.newChatForm.value.content ?? ''})
    this.chatGptService.sendRequest({content: this.newChatForm.value.content ?? ''})
      .subscribe((result: any) => {
        result.content = "gpt:" + result.content;
        this.chat.push(result);
      }
    );
    this.newChatForm.reset();
  }
}
