import { Component, OnInit, Directive, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
//import { messagingService } from '../../messaging.service';
import { io } from 'socket.io-client';
import {MatDialog} from "@angular/material/dialog";

const SOCKET_ENDPOINT = 'localhost:3080';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    //messageService: messagingService
  ) { }

  chats: any;
  curUser: any;
  socket;
  message: string;
  selectedChat?: any;

  getUserChats(){
    this.curUser = JSON.parse(sessionStorage.curUser || '{}');
    console.log(this.curUser);
    let x;
    for(x = 0; x < this.curUser.chats.length; x++){
      console.log(this.curUser.chats[x]);
    }
    this.chats = this.curUser.chats;
    console.log(this.chats);
  }

  ngOnInit(): void { 
      this.getUserChats();
      this.SetUpSocketConnection();
  }

  onSelect(chat: any): void {
    //reset the chat block 
    var ul = document.getElementById("message-list");
    while(ul?.firstChild) {
      ul.removeChild(ul.firstChild);
    }

    // get the history of the selected chat.
    this.selectedChat = chat;
    let data;
    console.log(this.selectedChat);
    axios.get('/api/messaging/chatHistory', { params: { prefix: chat } })
    .then((res) => {
        console.log(res);
        let x;
        for(x = 0; x < res.data.History.length; x++){
          this.displayMessage(res.data.History[x].sender, res.data.History[x].message);
        }
    });
    this.socket.emit("join", chat);
  }

  SetUpSocketConnection(){
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('message-broadcast', (sender: string, message: string) => {
      if (sender && message) {
        this.displayMessage(sender, message);
      }
    });
  }

  displayMessage(sender, message){
    const element = document.createElement('li');
    element.innerHTML = sender + ": " + message;
    element.style.background = 'white';
    element.style.padding =  '15px 30px';
    element.style.margin = '10px';
    const doc = document.getElementById('message-list');
    doc?.appendChild(element);
  }

  SendMessage(){
    console.log(this.message);
    this.socket.emit("message", this.selectedChat, this.curUser.user_name, this.message);
    this.message='';
  }

  NewChat(){

  }

}
