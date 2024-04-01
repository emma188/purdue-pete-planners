import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html'
})
export class EventEditComponent implements OnInit{
  repeat: number = 0;
  currentEvent;

  //submission vars
  form: FormGroup;
  loading = false;
  submitted = false;

  //ID of event to be edited
  id:string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {id: string};
    this.id = state.id;

    this.form = this.formBuilder.group({
      eventName: ['', Validators.required],
      eventDescription: ['', Validators.required],
      link: [''],
      location: ['', Validators.required],
      eventDate: [null, Validators.required],
      repeatChoice: [null],
      invitedUser: ['']
    });
  }

  ngOnInit() {
    this.getCurrentEvent();
    this.form = this.formBuilder.group({
      eventName: ['', Validators.required],
      eventDescription: ['', Validators.required],
      link: [''],
      location: ['', Validators.required],
      eventDate: [null, Validators.required],
      repeatChoice: [null],
      invitedUser: [null]
    });
    
  }
  
  searchResponse;
  getCurrentEvent(){
    //console.log("welcome to edit", this.id);
    let formatID = 'ObjectId(\"' + this.id + '\")';
    console.log(formatID);
    axios.get("/api/events/getCurrentEvent", { params: { prefix: this.id } })
    .then((res) => {
      if (typeof res.data == 'undefined'){
        //console.log("excuse me bitch?");
        this.searchResponse = ["No user events"];
      } else {
        //console.log("some form of data has been collected");
        this.currentEvent = res.data;
        console.log(this.currentEvent.name);
      }
    });
  }


  get f() { return this.form.controls; }

  
  onSubmit() {

    let curUser = JSON.parse(sessionStorage.curUser || '{}');
    let user = [curUser.user_name];

    this.submitted = true;
    let n = this.f.eventName.value;
    let e = this.f.eventDescription.value;
    let l = this.f.link.value;
    let L = this.f.location.value;
    let d = this.f.eventDate.value;
    let r = this.repeat;
    let i = this.f.invitedUser.value;

    if (this.form.invalid) {
      //alert('hey');
      return;
    }
    this.loading=true;
    //console.log(this.id, n, e, l, L, d, r);
    
    axios.post('/api/events/updateEvent', {
      _id: this.id,
      name: n,
      description: e,
      Time: d,
      link: l,
      location: L,
      repeat: r
    })
    .then((response) => {
      console.log(response);
      this.loading = true;
    });
    console.log("event updated... time 4 invite");

    if(i != null){
      console.log("sneding invite:", i, user, n, this.id);
      axios.post('/api/events/updateEventInvite', {
        reciever: i,
        sender: user,
        eventName: n,
        eventID: this.id
      })
      .then((response) =>{
        console.log(response)
      });
    }
    console.log("invite sent... allegedly");
    this.router.navigate(['eventPage']);
  }

  //Handles choosing repetiion for schedule
  repeatChoiceHandler(event: any){
    this.repeat = event.target.value;
  }
}
