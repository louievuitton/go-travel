import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormValidator } from '../validators/form.validators';
import { FirebaseService } from '../services/firebase.service';
import {TranslateService} from '@ngx-translate/core';

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
      FormValidator.cannotContainSpaces,
      FormValidator.invalidEmail
    ]),
    password: new FormControl('', [
      Validators.required,
      FormValidator.cannotContainSpaces,
      FormValidator.invalidPassword
    ])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    public translate: TranslateService) {
      translate.addLangs(['en', 'fr', 'hi']);
      translate.setDefaultLang('en');

      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/en|fr|hi/) ? browserLang : 'en');
  }

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
        localStorage.setItem('email', resources.get('email').value);
        if (this.route.snapshot.queryParamMap.get('returnUrl')) {
          if (
            this.route.snapshot.queryParamMap
              .get('returnUrl')
              .includes('flights')
          ) {
            this.router.navigate([
              this.route.snapshot.queryParamMap.get('returnUrl')
            ]);
          } else if (
            this.route.snapshot.queryParamMap.get('returnUrl').includes('hotel')
          ) {
            this.router.navigate(['/hotels']);
          } else {
            this.router.navigate(
              [this.route.snapshot.queryParamMap.get('returnUrl') || '/'],
              { queryParamsHandling: 'merge' }
            );
          }
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }

  navigate2Login() {
    this.router.navigate(['/login'], { queryParamsHandling: 'merge' });
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
