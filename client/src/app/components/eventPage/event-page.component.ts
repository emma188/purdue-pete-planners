import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import axios from 'axios';

@Component({
    selector: 'app-event-page',
    templateUrl: 'event-page.component.html',
    styleUrls: ['event-page.component.css']
  })
export class EventPageComponent implements OnInit /*, OnDestroy */{
  //Data service vars
  currentMessage:string;
  @Input() idToSend:string;
  @Output() toEventEdit = new EventEmitter();

  constructor(private router: Router) { 

  }

    //Current user
    curUser = JSON.parse(sessionStorage.curUser || '{}');
    user = this.curUser.user_name;

    //Storage for events to be displayed
    tabs;
    tabsAll;
    invites;
    invitedEvent;
    

    ngOnInit(): void {
        this.curUser = JSON.parse(sessionStorage.curUser || '{}');
        this.getAllUserEvents(this.curUser.user_name);
        this.getAllEvents();
        this.searchInvitedEvent(this.curUser.user_name);
        this.getAllInvites();
        //this.reloadComponent();
    }

    getAllInvites(){
      console.log("Searching for user's event invitations");
      axios.get('/api/events/searchUserEventInvites', {params: { prefix: this.user}})
      .then((res) => {
        //console.log("response in page", res.data);
        if(typeof res.data.event_invite[0] == 'undefined'){
          console.log("No invitations");
        }
        else{
          this.invites = res.data.event_invite;
          //console.log(this.invites);
          //console.log(this.invites[0][0]);
        }
      });
    }

    acceptEventInvite(inviteUser, inviteName, inviteID){
        console.log("Accepting invite...", inviteUser, inviteName, inviteID, this.user);
        axios.post('/api/events/acceptEventInvite', {params: {sentUser: inviteUser, sentName: inviteName, event_id: inviteID, user: this.user}})
        .then((res) => {
          console.log(res);
        });
        //refresh page
        this.reloadComponent();
    }

    declineEventInvite(inviteUser, inviteName, inviteID){
        console.log("Declining invite...");
        axios.post('/api/events/declineEventInvite', {params: {sentUser: inviteUser, sentName: inviteName, event_id: inviteID, user: this.user}})
        .then((res) => {
          console.log(res);
        });
        //refresh page
        this.reloadComponent();
    }

    sendID(sendId){
      //console.log(sendId);
      const navigationExtras: NavigationExtras = {state: {id: sendId}};
      this.router.navigate(['eventEdit'], navigationExtras);
    }

    gotoCreateEvent(){
      this.router.navigate(['event']);
    }

    getAllUserEvents(val:string){
        console.log("Searching for all user created events")
          axios.get(`/api/events/searchUserEvent`, { params: { prefix: val } })
          .then((res) => {
            //console.log(res.data[0])
            if (typeof res.data[0] == 'undefined'){
              //this.searchResponse = ["No user events"];
              console.log("No user events");
            } else {
              this.tabs = new Array(res.data.length);
              for(let i = 0; i < res.data.length; i++){
                this.tabs[i] = res.data[i];
              }
            }
          });
      }

      searchInvitedEvent(val:string){
        console.log("Searching for all user created events")
          axios.get(`/api/events/searchInvitedEvent`, { params: { prefix: val } })
          .then((res) => {
            //console.log(res.data[0])
            if (typeof res.data[0] == 'undefined'){
              //this.searchResponse = ["No user events"];
              console.log("No invited events");
            } else {
              this.invitedEvent = new Array(res.data.length);
              for(let i = 0; i < res.data.length; i++){
                this.invitedEvent[i] = res.data[i];
              }
            }
          });
      }

      getAllEvents(){
        axios.get("/api/events/getAllEvents")
          .then((res) => {
            if (typeof res.data[0] == 'undefined'){
              //this.searchResponse = ["No user events"];
              console.log("No user events");
            } else {
              this.tabsAll = new Array(res.data.length);
              for(let i = 0; i < res.data.length; i++){
                this.tabsAll[i] = res.data[i];
                //console.log(this.tabsAll[i].name);
              }
              
            }
          });
      }

      //delete event entirely
      deleteEvent( eventName, eventID){
          axios.post("/api/events/deleteEvent", {params: {user_delete: this.user, event_name: eventName, event_id: eventID}})
          .then((res) => {
            console.log(res);
          });
          //refresh page
          this.reloadComponent();
      }

      //remove from interest tabs
      removeEvent(idRemove){
          axios.post("/api/events/removeEvent", {params: {user_remove: this.user, event_id: idRemove}})
          .then((res) => {
            console.log(res);
          });
          //refresh page
          this.reloadComponent();
      }

      reloadComponent(){
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
      }
}