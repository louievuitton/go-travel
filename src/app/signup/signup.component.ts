import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormValidator } from '../validators/form.validators';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  invalidSignup: boolean;

  form = new FormGroup({
    firstname: new FormControl('', [
      Validators.required,
      FormValidator.cannotContainSpaces
    ]),
    lastname: new FormControl('', [
      Validators.required,
      FormValidator.cannotContainSpaces
    ]),
    email: new FormControl('', [
      Validators.required,
      FormValidator.cannotContainSpaces
    ]),
    password: new FormControl('', [
      Validators.required,
      FormValidator.cannotContainSpaces
    ])
  });

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {}

  signup(resources) {
    if (
      resources.get('firstname').value === '' ||
      resources.get('lastname').value === '' ||
      resources.get('email').value === '' ||
      resources.get('password').value === ''
    ) {
      this.invalidSignup = true;
    } else {
      this.firebaseService.signup(resources).then(response => {
        localStorage.setItem(
          'currentUser',
          resources.get('firstname').value +
            ' ' +
            resources.get('lastname').value
        );
        this.router.navigate(['/']);
      });
    }
  }

  get firstname() {
    return this.form.get('firstname');
  }

  get lastname() {
    return this.form.get('lastname');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
