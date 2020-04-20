import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormValidator } from '../validators/form.validators';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;

  form = new FormGroup({
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
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {}

  signIn(credentials) {
    if (
      credentials.get('email').value === '' ||
      credentials.get('password').value === ''
    ) {
      this.invalidLogin = true;
    } else {
      this.firebaseService.getResource('/users').subscribe(response => {
        for (let key in response as any) {
          let user = response[key];
          if (
            user['email'] === credentials.get('email').value &&
            user['password'] === credentials.get('password').value
          ) {
            localStorage.setItem(
              'currentUser',
              user['firstname'] + ' ' + user['lastname']
            );
            localStorage.setItem('email', user['email']);
            this.router.navigate(
              [this.route.snapshot.queryParamMap.get('returnUrl') || '/'],
              { queryParamsHandling: 'merge' }
            );
          } else {
            this.invalidLogin = true;
          }
        }
      });
    }
  }

  navigate2Signup() {
    this.router.navigate(['/signup'], { queryParamsHandling: 'merge' });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
