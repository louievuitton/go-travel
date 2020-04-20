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

  completeBooking(
    type,
    hotelCity,
    hotelName,
    roomName,
    nightsStay,
    departureTime,
    returnTime,
    dateFrom,
    dateTo,
    currentTime
  ) {
    if (type === 'hotel') {
      // complete hotel booking
      return this.db.list('/travels/hotels').push({
        email: localStorage.getItem('email'),
        city: hotelCity,
        hotelName: hotelName,
        roomName: roomName,
        nights: nightsStay,
        dateFrom: dateFrom,
        dateTo: dateTo
      });
    } else if (type === 'flight') {
      return this.db.list('/travels/flights').push({
        email: localStorage.getItem('email'),
        flightType: localStorage.getItem('flightType'),
        flyFrom: localStorage.getItem('flyFrom'),
        flyTo: localStorage.getItem('flyTo'),
        departureTime: departureTime,
        returnTime: returnTime,
        dateFrom: dateFrom,
        dateTo: dateTo,
        currentTimeOfPurchase: currentTime
      });
    }
  }
}
