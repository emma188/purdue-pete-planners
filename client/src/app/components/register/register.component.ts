import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import axios from 'axios';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {     
    this.form = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    verifyPassword: ['', [Validators.required]]
    });
  }


  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = this.f.password;
    const confirmPassword = this.f.verifyPassword;

    return password === confirmPassword ? null : { notSame: true }     
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      verifyPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    let pass = this.f.password.value;
    let verify = this.f.verifyPassword.value;

    //passwords must be the same
    /*if(pass != verify){
      return;
    }*/

    let fname = this.f.firstName.value;
    let lname = this.f.lastName.value;
    let uname = this.f.username.value;
    let email = this.f.email.value;

    axios.post('/api/account/register', {
      "first": fname,
      "last": lname,
      "uname": uname,
      "email": email,
      "pass": pass
    }).then((response) => {
      console.log(response);
      this.loading = true;
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.log(error);
    });

  }

}
