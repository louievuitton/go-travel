import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  StripeService,
  StripeCardComponent,
  ElementOptions,
  ElementsOptions
} from 'ngx-stripe';

// declare var Stripe: stripe.StripeStatic;

@Component({
  selector: 'check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit, OnDestroy {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
  stripeTest: FormGroup;

  params;
  classType: string;
  departureTime: string;
  returnTime: string;
  subscription;
  dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  flightPrice: number;
  totalFlightPrice: number;
  // hotel info
  hotelName: string;
  hotelImage;
  hotelRatings: string;
  hotelReviews: String;
  roomName: string;
  checkinDate: string;
  checkoutDate: string;
  nightsStay: number;
  roomPrice: number;
  totalHotelPrice: number;
  nights: number;
  // departure info
  departingDate: string;
  departingAirport: string;
  departureTotalStops: string;
  departureDuration: string;
  departingDurations = [];
  departingTimes = [];
  departingStops = [];
  departingFlightName: string;
  // return info
  returningDate: string;
  returningAirport: string;
  returnTotalStops: string;
  returnDuration: string;
  returnFlightName: string;
  returningDurations = [];
  returningTimes = [];
  returningStops = [];
  // others
  showDepartingDetailsAndBaggage: boolean = false;
  showReturningDetailsAndBaggage: boolean = false;
  adultsCount: number;
  adults = [];
  childrensCount = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.params = this.route.snapshot.queryParamMap;
    if (
      this.params.get('city') !== null &&
      this.params.get('hotelName') !== null &&
      this.params.get('roomName') !== null
    ) {
      // do hotels checkout
      this.firebaseService
        .getResource('/hotels/' + this.params.get('city').toLowerCase())
        .subscribe(res => {
          for (let key in res as any) {
            if (res[key]['name'] === this.params.get('hotelName')) {
              this.hotelImage = res[key]['images']['image1'];
              this.hotelName = res[key]['name'];
              this.hotelRatings = res[key]['ratings'];
              this.hotelReviews = res[key]['reviews'];
              for (let room in res[key]['rooms']) {
                if (
                  res[key]['rooms'][room]['name'] ===
                  this.params.get('roomName')
                ) {
                  this.roomName = res[key]['rooms'][room]['name'];
                  this.roomPrice = res[key]['rooms'][room]['price'];
                  break;
                }
              }
              break;
            }
          }
        });
      let checkin = new Date(localStorage.getItem('dateFrom'));
      let checkinMonth = this.months[checkin.getMonth()];
      this.checkinDate =
        this.dayOfWeek[checkin.getDay()] +
        ', ' +
        checkinMonth +
        ' ' +
        checkin.getDate();
      let checkout = new Date(localStorage.getItem('dateTo'));
      let checkoutMonth = this.months[checkout.getMonth()];
      this.checkoutDate =
        this.dayOfWeek[checkout.getDay()] +
        ', ' +
        checkoutMonth +
        ' ' +
        checkout.getDate();

      const diffTime = Math.abs(checkout.getTime() - checkin.getTime());
      this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.adultsCount = +localStorage.getItem('adultsCount');
    } else if (this.params.get('departureTime') !== null) {
      // load all departing and returning flight info
      this.classType = localStorage.getItem('classType');
      this.departureTime = this.route.snapshot.queryParamMap.get(
        'departureTime'
      );
      if (this.route.snapshot.queryParamMap.get('returnTime')) {
        this.returnTime = this.route.snapshot.queryParamMap.get('returnTime');
      } else {
        this.returnTime = null;
      }
      this.departingAirport = localStorage.getItem('flyFrom');
      this.returningAirport = localStorage.getItem('flyTo');

      let departureDate = new Date(localStorage.getItem('dateFrom'));
      let departureMonth = departureDate.getMonth() + 1;
      this.departingDate =
        this.dayOfWeek[departureDate.getDay()] +
        ', ' +
        departureMonth +
        '/' +
        departureDate.getDate();

      // used in 'Trip Summary' container
      this.adultsCount = +localStorage.getItem('adultsCount');
      for (let i = 0; i < this.adultsCount; i++) {
        this.adults.push(i + 1);
      }
      for (let i = 0; i < +localStorage.getItem('childrensCount'); i++) {
        this.childrensCount.push(i + 1);
      }

      if (localStorage.getItem('flightType') === 'roundtrip') {
        let returnDate = new Date(localStorage.getItem('dateTo'));
        let returningMonth = returnDate.getMonth() + 1;
        this.returningDate =
          this.dayOfWeek[returnDate.getDay()] +
          ', ' +
          returningMonth +
          '/' +
          returnDate.getDate();
        this.subscription = this.firebaseService
          .getResource('/flights/roundtrip')
          .subscribe(response => {
            for (let key in response as any) {
              if (
                response[key]['from'] === this.departingAirport &&
                response[key]['to'] === this.returningAirport
              ) {
                for (let flight in response[key]['departureAirlines']) {
                  if (
                    response[key]['departureAirlines'][flight]['time'] ===
                    this.departureTime
                  ) {
                    if (this.classType === 'economy') {
                      this.flightPrice =
                        response[key]['departureAirlines'][flight][
                          'economyPrice'
                        ];
                    } else if (this.classType === 'firstclass') {
                      this.flightPrice =
                        response[key]['departureAirlines'][flight][
                          'firstclassPrice'
                        ];
                    }
                    this.departureTotalStops =
                      response[key]['departureAirlines'][flight]['totalStops'];
                    this.departureDuration =
                      response[key]['departureAirlines'][flight][
                        'departureDuration'
                      ];
                    this.departingFlightName =
                      response[key]['departureAirlines'][flight]['name'];
                    this.departingDurations.push(
                      response[key]['departureAirlines'][flight][
                        'stopDurations'
                      ]
                    );
                    this.departingTimes.push(
                      response[key]['departureAirlines'][flight]['stopTimes']
                    );
                    this.departingStops.push(
                      response[key]['departureAirlines'][flight]['stops']
                    );
                    for (let retAirline in response[key]['departureAirlines'][
                      flight
                    ]['returningAirlines']) {
                      if (
                        response[key]['departureAirlines'][flight][
                          'returningAirlines'
                        ][retAirline]['time'] === this.returnTime
                      ) {
                        if (this.classType === 'economy') {
                          this.flightPrice +=
                            response[key]['departureAirlines'][flight][
                              'returningAirlines'
                            ][retAirline]['economyPrice'];
                        } else if (this.classType === 'firstclass') {
                          this.flightPrice +=
                            response[key]['departureAirlines'][flight][
                              'returningAirlines'
                            ][retAirline]['firstclassPrice'];
                        }
                        this.returnTotalStops =
                          response[key]['departureAirlines'][flight][
                            'returningAirlines'
                          ][retAirline]['totalStops'];
                        this.returnDuration =
                          response[key]['departureAirlines'][flight][
                            'returningAirlines'
                          ][retAirline]['returnDuration'];
                        this.returnFlightName =
                          response[key]['departureAirlines'][flight][
                            'returningAirlines'
                          ][retAirline]['name'];
                        this.returningDurations.push(
                          response[key]['departureAirlines'][flight][
                            'returningAirlines'
                          ][retAirline]['stopDurations']
                        );
                        this.returningTimes.push(
                          response[key]['departureAirlines'][flight][
                            'returningAirlines'
                          ][retAirline]['stopTimes']
                        );
                        this.returningStops.push(
                          response[key]['departureAirlines'][flight][
                            'returningAirlines'
                          ][retAirline]['stops']
                        );
                        this.departingTimes.forEach((elem, index) => {
                          this.departingTimes[index] = Object.values(elem);
                        });
                        this.departingDurations.forEach((elem, index) => {
                          this.departingDurations[index] = Object.values(elem);
                        });
                        this.departingStops.forEach((elem, index) => {
                          this.departingStops[index] = Object.values(elem);
                        });
                        this.returningTimes.forEach((elem, index) => {
                          this.returningTimes[index] = Object.values(elem);
                        });
                        this.returningDurations.forEach((elem, index) => {
                          this.returningDurations[index] = Object.values(elem);
                        });
                        this.returningStops.forEach((elem, index) => {
                          this.returningStops[index] = Object.values(elem);
                        });
                        // set total flight cost
                        if (+localStorage.getItem('childrensCount') === 0) {
                          this.totalFlightPrice =
                            this.flightPrice * this.adultsCount;
                        } else {
                          this.totalFlightPrice =
                            this.flightPrice *
                            (this.adultsCount +
                              +localStorage.getItem('childrensCount'));
                        }
                        return;
                      }
                    }
                  }
                }
              }
            }
          });
      } else if (localStorage.getItem('flightType') === 'oneway') {
        this.subscription = this.firebaseService
          .getResource('/flights/oneway')
          .subscribe(response => {
            for (let key in response as any) {
              if (
                response[key]['from'] === this.departingAirport &&
                response[key]['to'] === this.returningAirport
              ) {
                for (let flight in response[key]['departureAirlines']) {
                  if (
                    response[key]['departureAirlines'][flight]['time'] ===
                    this.departureTime
                  ) {
                    if (this.classType === 'economy') {
                      this.flightPrice =
                        response[key]['departureAirlines'][flight][
                          'economyPrice'
                        ];
                    } else if (this.classType === 'firstclass') {
                      this.flightPrice =
                        response[key]['departureAirlines'][flight][
                          'firstclassPrice'
                        ];
                    }
                    this.departureTotalStops =
                      response[key]['departureAirlines'][flight]['totalStops'];
                    this.departureDuration =
                      response[key]['departureAirlines'][flight][
                        'departureDuration'
                      ];
                    this.departingFlightName =
                      response[key]['departureAirlines'][flight]['name'];
                    this.departingDurations.push(
                      response[key]['departureAirlines'][flight][
                        'stopDurations'
                      ]
                    );
                    this.departingTimes.push(
                      response[key]['departureAirlines'][flight]['stopTimes']
                    );
                    this.departingStops.push(
                      response[key]['departureAirlines'][flight]['stops']
                    );
                    this.departingTimes.forEach((elem, index) => {
                      this.departingTimes[index] = Object.values(elem);
                    });
                    this.departingDurations.forEach((elem, index) => {
                      this.departingDurations[index] = Object.values(elem);
                    });
                    this.departingStops.forEach((elem, index) => {
                      this.departingStops[index] = Object.values(elem);
                    });
                    // set total flight cost
                    if (+localStorage.getItem('childrensCount') === 0) {
                      this.totalFlightPrice =
                        this.flightPrice * this.adultsCount;
                    } else {
                      this.totalFlightPrice =
                        this.flightPrice *
                        (this.adultsCount +
                          +localStorage.getItem('childrensCount'));
                    }
                    return;
                  }
                }
              }
            }
          });
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get currentUser() {
    return localStorage.getItem('currentUser');
  }

  navigateToLogin() {
    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: 'checkout'
      },
      queryParamsHandling: 'merge'
    });
  }

  toggleDepartingDetailsAndBaggage() {
    this.showDepartingDetailsAndBaggage = !this.showDepartingDetailsAndBaggage;
  }

  toggleReturningDetailsAndBaggage() {
    this.showReturningDetailsAndBaggage = !this.showReturningDetailsAndBaggage;
  }

  // when user clicks on 'Complete Booking' button
  bookTrip() {
    if (localStorage.getItem('hotelDestination') !== null) {
      this.firebaseService
        .completeBooking(
          'hotel',
          this.params.get('city'),
          this.params.get('hotelName'),
          this.params.get('roomName'),
          this.nights,
          '',
          '',
          localStorage.getItem('dateFrom'),
          localStorage.getItem('dateTo'),
          new Date().toString()
        )
        .then(res => {
          // navigate user to confirmation page
          this.router.navigate(['/checkout-success'], {
            queryParams: {
              confirmation: 'hotel',
              hotel: this.params.get('hotelName')
            }
          });
        });
    } else if (localStorage.getItem('hotelDestination') === null) {
      if (localStorage.getItem('flightType') === 'roundtrip') {
        this.firebaseService
          .completeBooking(
            'flight',
            '',
            '',
            '',
            '',
            this.params.get('departureTime'),
            this.params.get('returnTime'),
            localStorage.getItem('dateFrom'),
            localStorage.getItem('dateTo'),
            new Date().toString()
          )
          .then(res => {
            // navigate user to confirmation page
            this.router.navigate(['/checkout-success'], {
              queryParams: {
                confirmation: 'flight'
              }
            });
          });
      } else if (localStorage.getItem('flightType') === 'oneway') {
        this.firebaseService
          .completeBooking(
            'flight',
            '',
            '',
            '',
            '',
            this.params.get('departureTime'),
            '',
            localStorage.getItem('dateFrom'),
            '',
            new Date().toString()
          )
          .then(res => {
            // navigate user to confirmation page
            this.router.navigate(['/checkout-success'], {
              queryParams: {
                confirmation: 'flight'
              }
            });
          });
      }
    }
    // this.stripeService
    //   .createToken(this.card.getCard(), { name })
    //   .subscribe(result => {
    //     if (result.token) {
    //       // Use the token to create a charge or a customer
    //       // https://stripe.com/docs/charges
    //       console.log(result.token.id);
    //     } else if (result.error) {
    //       // Error creating the token
    //       console.log(result.error.message);
    //     }
    //   });
  }
}
