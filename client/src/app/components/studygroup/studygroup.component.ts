

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import axios from 'axios';
import {ActivatedRoute, Router} from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-studygroup',
  templateUrl: './studygroup.component.html',
  styleUrls: ['./studygroup.component.css']
})
export class StudygroupComponent implements OnInit {

  constructor() {
    this.initPage(this.user);
  }
  clickMessage = 'asfsf';
  classes = ['CS 381', 'CS407'];
  activeLink = this.classes[0];
  curUser = JSON.parse(sessionStorage.curUser || '{}');
  user = this.curUser.user_name;
  curStudyGroup = 'CS 381';
  tableargs1 = {data: [""], type: 'member'};
  tableargs2 = {data: [""], type: 'chat_room'};
  tableargs3 = {data: [""], type: 'study_room'};
  tableargs4 = {data: [""], type: 'announcement'};
  tableargs6 = {data: [""], type: 'comments'};
  tablemember: string[] = [];
  tablechatroom: string[] = [];
  tablestudyroom: string[] = [];
  tablemeetingtime: Date;

  tableannoucement: string[] = [];
  //Form creation
  isMemeber = false;
  StudyGroupData = this.curUser.study_group;
  commentexpand = false;
  announcementexpand = false;
  newcomment = [''];
  newannouncement = [''];
  isFriend = false;
  enteredname = false;
  //inviting users
  expanded = false;
  displayStudyInvite = false;
  searchResponse: string[] = [];
  type = 'none';
  tableargs5 = {data: this.searchResponse, type: 'studyinvite'};
  //comments
  displayedColumns = ['studyinvite', 'sendstudyinv'];
  tablecomments: string[] = [];

  name = [];



  ngOnInit(): void {
    this.name = this.curUser.study_group;
  }

  initPage(val: string) {
    axios.get(`/api/account/searchStudyGroup`, { params: { prefix: 'CS 381' } })
      .then((res) => {
        if (typeof res.data[0] === 'undefined') {
          this.tablemember = ["no member"];
          this.tablechatroom = ["no chat room"];
          this.tablestudyroom = ["no study room"];
        } else {
          this.tablemember = res.data[0].Member;
          this.tablechatroom = res.data[0].Chat_room;
          this.tablestudyroom = res.data[0].Study_room;
          this.tablemeetingtime = res.data[0].Meeting_time;
          this.tableannoucement = res.data[0].Announcement;
          this.tablecomments = res.data[0].Comments;

        }
        if (this.tablemember.indexOf(this.user) === -1) {
          this.isMemeber = false;
          console.log('false');
        } else {
          this.isMemeber = true;
          console.log('true');
        }
        this.tableargs1 = {data: this.tablemember, type: 'member'};
        this.tableargs2 = {data: this.tablechatroom, type: 'chat_room'};
        this.tableargs3 = {data: this.tablestudyroom, type: 'study_room'};
        this.tableargs4 = {data: this.tableannoucement, type: 'announcement'};
        this.tableargs6 = {data: this.tablecomments, type: 'Comments'};
      });
  }

  onTabClick(event: any) {
    console.log(event.tab.textLabel);
    this.curStudyGroup = event.tab.textLabel;
    axios.get(`/api/account/searchStudyGroup`, { params: { prefix: event.tab.textLabel } })
      .then((res) => {
        if (typeof res.data[0] === 'undefined') {
          this.tablemember = ["no member"];
          this.tablechatroom = ["no chat room"];
          this.tablestudyroom = ["no study room"];
          console.log(this.tablemember);
        } else {
          this.tablemember = res.data[0].Member;
          this.tablechatroom = res.data[0].Chat_room;
          this.tablestudyroom = res.data[0].Study_room;
          this.tablemeetingtime = res.data[0].Meeting_time;
          this.tableannoucement = res.data[0].Announcement;
          this.tablecomments = res.data[0].Comments;
          console.log(res.data[0]);
          console.log(this.tablemember);
        }
        this.tableargs1 = {data: this.tablemember, type: 'member'};
        this.tableargs2 = {data: this.tablechatroom, type: 'chat_room'};
        this.tableargs3 = {data: this.tablestudyroom, type: 'study_room'};
        this.tableargs4 = {data: this.tableannoucement, type: 'announcement'};
        this.tableargs6 = {data: this.tablecomments, type: 'Comments'};
        console.log(this.tableargs3);
        console.log(this.tablemeetingtime);
      });
  }

  refresh() {
    console.log("refreshing");
    this.initPage(this.user);
  }

  clickedjoin(event: any) {
    axios.post('/api/account/updateStudyGroupRequest', { curUser: this.curUser.user_name, data: this.curStudyGroup});
  }

  clickedCommentsubmit(value) {
    this.newcomment = value;
    console.log(this.newcomment);
    axios.post('/api/account/updateStudyGroupComment', { data: this.curStudyGroup, entered: this.newcomment });
    this.commentexpand = false;
  }

  clickedAnnouncesubmit(value) {
    console.log(value);
    this.newannouncement = value;
    console.log(this.newannouncement);
    console.log(this.curUser.user_name);
    axios.post('/api/account/updateStudyGroupAnnounce', {
      data: this.curStudyGroup, entered: this.newannouncement
    });
    this.announcementexpand = false;
  }

  getSearchValue(val: string) {
    this.enteredname = true;
    axios.get(`/api/account/searchUsers`, {params: {prefix: val}})
      .then((res) => {
        console.log(res.data[0])
        if (typeof res.data[0] === 'undefined') {
          this.searchResponse = ["No matching user"]
          this.isFriend = false;
        } else {
          this.searchResponse = [res.data[0].user_name]
          this.isFriend = true;
        }
        this.type = 'studyinvite'
        this.displayStudyInvite = true
        this.tableargs5 = {data: this.searchResponse, type: this.type}
      });
  }

  clickedStudyRequest(value) {
    //console.log(username)
    axios.post('/api/account/updateStudyGroupRequest', { curUser: value, data: this.curStudyGroup });
    this.enteredname = false;
  }

  clickedBacktoName() {
    this.isFriend = false;
    this.enteredname = false;
  }
}
