import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { NgForm } from '@angular/forms';
import { formatDate } from '@fullcalendar/angular';
import axios from 'axios';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit{
  loading = false;
  curUser = JSON.parse(sessionStorage.curUser || '{}');
  calendarOptions: CalendarOptions = {
    // dayGridDay, dayGridWeek
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this), // bind is important!
  };
  constructor() {
    //this.initPage(this.curUser.user_name);
  }

  events = [];
  event2 = {title: '123', date: '2021-03-03'};
  event = {};
  option = '';
  newEvent;


  i = 0;
  due = [];
  realdue = [];
  ngOnInit(): void {
    axios.get(`/api/schedule/getEvent`, {params: {prefix: this.curUser.user_name}})
      .then((res) => {
        console.log(res.data[0].schedule[0]);
        this.events = res.data[0].schedule;
        console.log(this.events);
        this.calendarOptions.events = this.events;
        /*for (this.i = 0; this.i < res.data[0].schedule[0].length(); this.i++) {
          // @ts-ignore
          this.events[this.i] = res.data[0].schedule[0][this.i];
        }*/
      });
  }
  // tslint:disable-next-line:variable-name
  initPage(val: string) {
    // @ts-ignore
    // this.events.push(this.event2);
    //console.log(this.events);

  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr);
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends; // toggle the boolean!
  }

  onSubmit(form: NgForm) {
    // @ts-ignore
    /*this.events.push(this.event);
    console.log(this.events);
    this.calendarOptions.events = this.events;
    console.log(this.calendarOptions.events);*/
    this.refresh();
    if(form.value.title == "" || form.value.content == "") {
      alert('Bad Input');
      return;
    }
    this.loading = true;
    axios.post('/api/schedule/createSchedule', {
      title: form.value.title,
      date: form.value.content,
      userName: this.curUser.user_name,
      link:"no link"
    })
      .then((response) => {
        console.log(response);
        this.loading = true;
      });
  }
  refresh() {
    console.log('refreshing');
    this.ngOnInit();
  }
}
