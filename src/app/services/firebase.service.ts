import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private db: AngularFireDatabase) {}

  signup(resources) {
    return this.db.list('users').push({
      email: resources.get('email').value,
      password: resources.get('password').value,
      firstname: resources.get('firstname').value,
      lastname: resources.get('lastname').value
    });
  }

  getResource(resources) {
    return this.db.object(resources).valueChanges();
  }

  getAll(resources) {
    return this.db.list(resources).valueChanges();
  }
}
