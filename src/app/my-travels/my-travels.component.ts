import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { exists } from 'fs';

@Component({
  selector: 'my-travels',
  templateUrl: './my-travels.component.html',
  styleUrls: ['./my-travels.component.css']
})
export class MyTravelsComponent implements OnInit, OnDestroy {
  subscription;
  showFlights: boolean = false;
  showHotels: boolean = false;
  flights = [];
  roundtripFlights = [];
  // departing flights info
  departingDates = [];
  departureTime = [];
  departingAirports = [];
  departingAirlines = [];
  departingTotalStops = [];
  departingTotalDurations = [];
  departingDurations = [];
  departingTimes = [];
  departingStops = [];
  // returning flights info
  returningDates = [];
  returnTime = [];
  returningAirports = [];
  returningAirlines = [];
  returningTotalStops = [];
  returningTotalDurations = [];
  returningDurations = [];
  returningTimes = [];
  returningStops = [];
  // hotels info
  hotels = [];
  hotelImages = [];
  hotelNames = [];
  hotelRatings = [];
  hotelReviews = [];
  hotelRooms = [];
  checkInDates = [];
  checkOutDates = [];
  roomPrices = [];
  tripTotal = [];
  nights = [];
  peopleCount = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.extractTravels();
  }

  extractTravels() {
    this.firebaseService.getAll('/travels/flights').subscribe(res => {
      for (let k in res as any) {
        if (res[k]['email'] === localStorage.getItem('email')) {
          this.flights.push(res[k]);
        }
      }
    });

    this.firebaseService.getAll('/travels/hotels').subscribe(res => {
      for (let k in res as any) {
        if (res[k]['email'] === localStorage.getItem('email')) {
          this.hotels.push(res[k]);
        }
      }
    });
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  fetchHotels() {
    this.hotels.reverse().forEach(hotel => {
      this.firebaseService
        .getResource('/hotels/' + hotel['city'].toLowerCase())
        .subscribe(response => {
          for (let key in response as any) {
            if (response[key]['name'] === hotel['hotelName']) {
              this.hotelNames.push(response[key]['name']);
              this.hotelImages.push(response[key]['images']['image1']);
              this.hotelRatings.push(response[key]['ratings']);
              this.hotelReviews.push(response[key]['reviews']);
              this.checkInDates.push(hotel['dateFrom']);
              this.checkOutDates.push(hotel['dateTo']);
              this.nights.push(hotel['nights']);
              for (let room in response[key]['rooms']) {
                if (
                  response[key]['rooms'][room]['name'] === hotel['roomName']
                ) {
                  this.hotelRooms.push(response[key]['rooms'][room]['name']);
                  this.roomPrices.push(response[key]['rooms'][room]['price']);
                }
              }
            }
          }
        });
    });
  }

  fetchFlights() {
    this.flights.reverse().forEach(flight => {
      if (flight['flightType'] === 'roundtrip') {
        this.subscription = this.firebaseService
          .getResource('/flights/roundtrip')
          .subscribe(res => {
            for (let key in res as any) {
              if (
                res[key]['from'] === flight['flyFrom'] &&
                res[key]['to'] === flight['flyTo']
              ) {
                for (let departingAirline in res[key]['departureAirlines']) {
                  if (
                    res[key]['departureAirlines'][departingAirline]['time'] ===
                    flight['departureTime']
                  ) {
                    // set departing flight info
                    this.departureTime.push(flight['departureTime']);
                    this.departingDates.push(flight['dateFrom']);
                    this.departingAirports.push(flight['flyFrom']);
                    this.departingAirlines.push(
                      res[key]['departureAirlines'][departingAirline]['name']
                    );
                    this.departingTotalStops.push(
                      res[key]['departureAirlines'][departingAirline][
                        'totalStops'
                      ]
                    );
                    this.departingTotalDurations.push(
                      res[key]['departureAirlines'][departingAirline][
                        'departureDuration'
                      ]
                    );
                    this.departingTimes.push(
                      res[key]['departureAirlines'][departingAirline][
                        'stopTimes'
                      ]
                    );
                    this.departingDurations.push(
                      res[key]['departureAirlines'][departingAirline][
                        'stopDuratons'
                      ]
                    );
                    this.departingStops.push(
                      res[key]['departureAirlines'][departingAirline]['stops']
                    );
                    for (let ret in res[key]['departureAirlines'][
                      departingAirline
                    ]['returningAirlines']) {
                      if (
                        res[key]['departureAirlines'][departingAirline][
                          'returningAirlines'
                        ][ret]['time'] === flight['returnTime']
                      ) {
                        this.returningDates.push(flight['dateTo']);
                        this.returnTime.push(flight['returnTime']);
                        this.returningAirports.push(flight['flyTo']);
                        this.returningAirlines.push(
                          res[key]['departureAirlines'][departingAirline][
                            'returningAirlines'
                          ][ret]['name']
                        );
                        this.returningTotalStops.push(
                          res[key]['departureAirlines'][departingAirline][
                            'returningAirlines'
                          ][ret]['totalStops']
                        );
                        this.returningTotalDurations.push(
                          res[key]['departureAirlines'][departingAirline][
                            'returningAirlines'
                          ][ret]['returnDuration']
                        );
                        this.returningTimes.push(
                          res[key]['departureAirlines'][departingAirline][
                            'returningAirlines'
                          ][ret]['stopTimes']
                        );
                        this.returningDurations.push(
                          res[key]['departureAirlines'][departingAirline][
                            'returningAirlines'
                          ][ret]['stopDurations']
                        );
                        this.returningStops.push(
                          res[key]['departureAirlines'][departingAirline][
                            'returningAirlines'
                          ][ret]['stops']
                        );
                        break;
                      }
                    }
                  }
                }
                break;
              }
            }
          });
      } else if (flight['flightType'] === 'oneway') {
        this.subscription = this.firebaseService
          .getResource('/flights/oneway')
          .subscribe(res => {
            for (let key in res as any) {
              if (
                res[key]['from'] === flight['flyFrom'] &&
                res[key]['to'] === flight['flyTo']
              ) {
                for (let departingAirline in res[key]['departureAirlines']) {
                  if (
                    res[key]['departureAirlines'][departingAirline]['time'] ===
                    flight['departureTime']
                  ) {
                    // set departing flight info
                    this.departureTime.push(flight['departureTime']);
                    this.departingDates.push(flight['dateFrom']);
                    this.departingAirports.push(flight['flyFrom']);
                    this.departingAirlines.push(
                      res[key]['departureAirlines'][departingAirline]['name']
                    );
                    this.departingTotalStops.push(
                      res[key]['departureAirlines'][departingAirline][
                        'totalStops'
                      ]
                    );
                    this.departingTotalDurations.push(
                      res[key]['departureAirlines'][departingAirline][
                        'departureDuration'
                      ]
                    );
                    this.departingTimes.push(
                      res[key]['departureAirlines'][departingAirline][
                        'stopTimes'
                      ]
                    );
                    this.departingDurations.push(
                      res[key]['departureAirlines'][departingAirline][
                        'stopDuratons'
                      ]
                    );
                    this.departingStops.push(
                      res[key]['departureAirlines'][departingAirline]['stops']
                    );

                    this.returningDates.push('');
                    this.returnTime.push('');
                    this.returningAirports.push('');
                    this.returningAirlines.push('');
                    this.returningTotalStops.push('');
                    this.returningTotalDurations.push('');
                    this.returningTimes.push(['']);
                    this.returningDurations.push(['']);
                    this.returningStops.push(['']);
                  }
                }
                break;
              }
            }
          });
      }
    });
  }

  outputTravels(event) {
    if (event === 'flights') {
      this.showHotels = false;
      this.fetchFlights();
      this.showFlights = true;
    } else if (event === 'hotels') {
      this.showFlights = false;
      this.fetchHotels();
      this.showHotels = true;
    }
  }
}
