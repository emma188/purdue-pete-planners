import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {ConfirmedValidator} from './confirmedValidator';
import axios from "axios";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;

  username = '';
  email = '';
  phone = '';
  major = '';
  address = '';

  curUser = JSON.parse(sessionStorage.curUser || '{}');
  user = this.curUser.user_name;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      username: [this.user], // ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      major: [''],
      address: [''],
      password: ['', [Validators.minLength(4), Validators.required, Validators.nullValidator]],
      confirmPassword: ['', [Validators.required, Validators.nullValidator]]
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword'),
      validator2: ConfirmedValidator('password', this.curUser.password)
    });
  }

  ngOnInit(): void {
    this.curUser = JSON.parse(sessionStorage.curUser || '{}');
    this.form = this.formBuilder.group({
      username: [this.user],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern('[- +()0-9]+')]],
      major: [''],
      address: [''],
      password: ['', [Validators.minLength(4), Validators.required, Validators.nullValidator]],
      confirmPassword: ['', [Validators.required, Validators.nullValidator]]
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword'),
      validator2: ConfirmedValidator('password', this.curUser.password)
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    this.curUser.email = this.f.email.value;
    this.curUser.phone = this.f.phone.value;
    this.curUser.major = this.f.major.value;
    this.curUser.address = this.f.address.value;
    this.curUser.password = this.f.password.value;

    console.log(this.curUser);
    // alert('New values: \n\n' + JSON.stringify(this.form.value, null, 4));
  }

  get userInfo(){
    return this.user;
  }

  resetform() {
    this.submitted = false;
    this.form.reset();
  }

  // need first ability to add users
  deleteUser() {
    // admin.auth().deleteUser(uid)
    // .then(function() {
    //   console.log('Successfully deleted user');
    // })
    // .catch(function(error) {
    //   console.log('Error deleting user:', error);
    // });
  }
}
