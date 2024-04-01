import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  curUser = JSON.parse(sessionStorage.curUser || '{}');
  email = '';
  classlist = [];
  className = [];
  due = [];
  dueDate = [];
  dueTitle = [];
  realdue = [];
  i = 0;
  j = 0;
  friendLen = 0;
  eventTitle = [];
  eventLink = [];


  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.curUser = JSON.parse(sessionStorage.curUser || '{}');
    this.friendLen = (this.curUser.friend).length
    this.email = this.curUser.email;
    this.classlist = this.curUser.class_list;
    axios.get(`/api/home/getDue`, {params: {prefix: this.curUser.user_name}})
      .then((res) => {
        console.log(res.data[0].schedule);
        this.due = res.data[0].schedule;
        // @ts-ignore
        for(this.i = 0; this.i < this.due.length; this.i++ ) {
          // @ts-ignore
          if(res.data[0].schedule[this.i].link == "no link"){
            // @ts-ignore
            this.dueTitle[this.i] = this.due[this.i].title;
            // @ts-ignore
            this.dueDate[this.i] = this.due[this.i].date;
          }
          else {
            // @ts-ignore
            this.eventTitle[this.i] = this.due[this.i].title;
            // @ts-ignore
            this.eventLink[this.i] = this.due[this.i].link;
          }
        }
        console.log(this.dueDate);
        /*for (this.i = 0; this.i < res.data[0].schedule[0].length(); this.i++) {
          // @ts-ignore
          this.events[this.i] = res.data[0].schedule[0][this.i];
        }*/
      });
    /*for (this.j = 0; this.j < this.classlist.length; this.j++) {
      // @ts-ignore
      this.className[this.j] = this.curUser.class_list[this.j].class_tag;
    }*/
    this.due = this.curUser.due;
    if (typeof this.due !== 'undefined') {
      for (this.i = 0; this.i < this.due.length; this.i++ ) {
        // @ts-ignore
        this.realdue[this.i] = Object.values(this.due[this.i]);
      }
   }
  }
  refresh() {
    console.log("refresshing");
    this.ngOnInit();
  }

  ngOnChanges() {
    console.log("trigger on change")
    this.ngOnInit()
  }
}


