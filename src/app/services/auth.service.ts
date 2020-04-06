import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private db: AngularFireDatabase) {}

  login(credentials) {
    return this.db
      .object('/users/' + credentials.get('username').value)
      .valueChanges();
    // if (readObj === null) {
    //   return false;
    // } else {
    //   return this.db
    //     .object('/users/' + credentials.get('username').value)
    //     .valueChanges()
    //     .subscribe(response => {
    //       if (response['password'] === credentials.get('password').value) {
    //         localStorage.setItem(
    //           'currentUser',
    //           response['firstname'] + ' ' + response['lastname']
    //         );
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     });
    // }
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}
