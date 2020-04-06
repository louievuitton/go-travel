import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormValidator } from '../validators/form.validators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;

  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      FormValidator.cannotContainSpaces
    ]),
    password: new FormControl('', [
      Validators.required,
      FormValidator.cannotContainSpaces
    ])
  });

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  signIn(credentials) {
    if (
      credentials.get('username').value === '' ||
      credentials.get('password').value === ''
    ) {
      this.invalidLogin = true;
    } else {
      this.authService.login(credentials).subscribe(response => {
        if (response === null) {
          this.invalidLogin = true;
        } else {
          if (response['password'] === credentials.get('password').value) {
            localStorage.setItem(
              'currentUser',
              response['firstname'] + ' ' + response['lastname']
            );
            console.log('shit works');
            this.router.navigate(['/']);
          } else {
            this.invalidLogin = true;
          }
        }
      });
    }
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }
}
