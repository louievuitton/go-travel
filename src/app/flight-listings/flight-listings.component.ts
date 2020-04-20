import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { element } from 'protractor';

@Component({
  selector: 'flight-listings',
  templateUrl: './flight-listings.component.html',
  styleUrls: ['./flight-listings.component.css']
})
export class FlightListingsComponent implements OnInit, OnDestroy {
  departingFlights = [];
  returningFlights = [];
  airports = [];
  dropdownVisible: boolean = false;
  firstInput: string;
  showDepartingFlights: boolean;
  showReturningFlights: boolean = false;
  departingCity: string;
  returningCity: string;
  departingDate: string;
  returningDate: string;
  dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
  mySubscription: any;
  minDate: Date;
  maxDate: Date;
  minDate1: Date;
  maxDate1: Date;
  date: Date;
  fromDate: Date;
  toDate: Date;
  flightType: string;
  classType: string;
  showDetailsAndBaggage: boolean = false;
  flightTime: string;
  departDuration: string;
  stopDurations = [];
  stopTimes = [];
  stops = [];
  returnstopDurations = [];
  returnstopTimes = [];
  returnStops = [];
  flght: boolean;
  clss: boolean;
  adultsCount: number;
  childrensCount: number;
  mouseovr: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this.mySubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit(): void {
    this.date = new Date();
    this.minDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate()
    );
    this.maxDate = new Date(this.date.getFullYear() + 1, 11, 31);
    this.minDate1 = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate()
    );
    this.maxDate1 = new Date(this.date.getFullYear() + 1, 11, 31);

    if (
      localStorage.getItem('flightType') !== null &&
      localStorage.getItem('classType') !== null
    ) {
      if (localStorage.getItem('classType') === 'economy') {
        this.clss = true;
      } else if (localStorage.getItem('classType') === 'firstclass') {
        this.clss = false;
      }
      if (localStorage.getItem('flightType') === 'roundtrip') {
        this.flght = true;
        this.flightType = localStorage.getItem('flightType');
        this.classType = localStorage.getItem('classType');
        this.showContent(
          localStorage.getItem('flightType'),
          localStorage.getItem('classType'),
          new Date(localStorage.getItem('dateFrom')),
          new Date(localStorage.getItem('dateTo'))
        );
      } else if (localStorage.getItem('flightType') === 'oneway') {
        this.flght = false;
        this.flightType = localStorage.getItem('flightType');
        this.classType = localStorage.getItem('classType');
        this.showContent(
          localStorage.getItem('flightType'),
          localStorage.getItem('classType'),
          new Date(localStorage.getItem('dateFrom')),
          new Date()
        );
      }
    } else {
      localStorage.setItem('flightType', 'roundtrip');
      localStorage.setItem('classType', 'economy');
      this.showDepartingFlights = false;
      this.flght = true;
      this.clss = true;
    }
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  typeOfFlightChanged() {
    if (localStorage.getItem('flightType') === 'roundtrip') {
      localStorage.setItem('flightType', 'oneway');
      this.flght = !this.flght;
    } else if (localStorage.getItem('flightType') === 'oneway') {
      localStorage.setItem('flightType', 'roundtrip');
      this.flght = !this.flght;
    }
  }

  typeOfClassChanged() {
    if (localStorage.getItem('classType') === 'economy') {
      localStorage.setItem('classType', 'firstclass');
      this.clss = !this.clss;
    } else if (localStorage.getItem('classType') === 'firstclass') {
      localStorage.setItem('classType', 'economy');
      this.clss = !this.clss;
    }
  }

  searchAirports(event: HTMLInputElement, whichInput) {
    this.airports = [];
    this.firstInput = whichInput;

    this.firebaseService
      .getResource('airports/' + event.value.toLowerCase())
      .subscribe(response => {
        for (let key in response as any) {
          this.airports.push(response[key]);
        }
      });

    this.dropdownVisible = true;
    // } else if (event.value === 'lax') {
    //   this.firebaseService.getAll('flights').subscribe(response => {
    //     for (let key in response as any) {
    //       if (response[key]['name'] === event)
    //     }
    //   });
    // }
  }

  inputBlur() {
    if (this.mouseovr === false) {
      this.dropdownVisible = false;
    }
  }

  toggleMouseOver(mouseovr) {
    this.mouseovr = mouseovr;
  }

  // date selected from DatePicker
  dateSelected(type, event: MatDatepickerInputEvent<Date>) {
    let datepicked = event.value;
    if (type === 'checkin') {
      this.minDate1 = new Date(
        datepicked.getFullYear(),
        datepicked.getMonth(),
        datepicked.getDate() + 1
      );
      this.fromDate = new Date(
        datepicked.getFullYear(),
        datepicked.getMonth(),
        datepicked.getDate()
      );
    } else if (type === 'checkout') {
      this.maxDate = new Date(
        event.value.getFullYear(),
        event.value.getMonth(),
        event.value.getDate()
      );
      this.toDate = new Date(
        datepicked.getFullYear(),
        datepicked.getMonth(),
        datepicked.getDate()
      );
    }
  }

  setAirlines(airport) {
    if (this.firstInput === 'from') {
      localStorage.setItem('flyFrom', airport);
      this.dropdownVisible = false;
      this.mouseovr = false;
    } else if (this.firstInput === 'to') {
      localStorage.setItem('flyTo', airport);
      this.dropdownVisible = false;
      this.mouseovr = false;
    }
  }

  // when 'Search' is clicked
  showDepartureFlights() {
    this.showReturningFlights = false;
    this.departingFlights = [];
    this.stopDurations = [];
    this.stopTimes = [];
    this.stops = [];
    this.returningFlights = [];
    this.returnStops = [];
    this.returnstopDurations = [];
    this.returnstopTimes = [];
    this.flightType = localStorage.getItem('flightType');
    this.classType = localStorage.getItem('classType');
    if (this.flightType === 'roundtrip') {
      localStorage.setItem(
        'dateFrom',
        this.fromDate.getMonth() +
          1 +
          '/' +
          this.fromDate.getDate() +
          '/' +
          this.fromDate.getFullYear()
      );
      localStorage.setItem(
        'dateTo',
        this.toDate.getMonth() +
          1 +
          '/' +
          this.toDate.getDate() +
          '/' +
          this.toDate.getFullYear()
      );

      if (localStorage.getItem('adultsCount') === null) {
        localStorage.setItem('adultsCount', '1');
      }
      if (localStorage.getItem('childrensCount') === null) {
        localStorage.setItem('childrensCount', '0');
      }

      this.showContent(
        this.flightType,
        this.classType,
        this.fromDate,
        this.toDate
      );
    } else if (this.flightType === 'oneway') {
      if (localStorage.getItem('dateTo') !== null) {
        localStorage.removeItem('dateTo');
      }
      localStorage.setItem(
        'dateFrom',
        this.fromDate.getMonth() +
          1 +
          '/' +
          this.fromDate.getDate() +
          '/' +
          this.fromDate.getFullYear()
      );

      if (localStorage.getItem('adultsCount') === null) {
        localStorage.setItem('adultsCount', '1');
      }
      if (localStorage.getItem('childrensCount') === null) {
        localStorage.setItem('childrensCount', '0');
      }

      this.showContent(this.flightType, this.classType, this.fromDate, null);
    }
  }

  // if user has entered information from homepage
  showContent(flightType, classType, departureDate, returnDate) {
    if (flightType === 'roundtrip') {
      if (
        localStorage.getItem('dateFrom') !== null &&
        localStorage.getItem('dateTo') !== null &&
        localStorage.getItem('flyFrom') !== null &&
        localStorage.getItem('flyTo') !== null
      ) {
        let i1 = localStorage.getItem('flyFrom').indexOf('(');
        let i2 = localStorage.getItem('flyTo').indexOf('(');
        this.returningCity = localStorage
          .getItem('flyFrom')
          .substring(0, i1 - 1);
        this.departingCity = localStorage.getItem('flyTo').substring(0, i2 - 1);

        let departureMonth = departureDate.getMonth() + 1;
        let returningMonth = returnDate.getMonth() + 1;
        this.departingDate =
          this.dayOfWeek[departureDate.getDay()] +
          ', ' +
          departureMonth +
          '/' +
          departureDate.getDate();
        this.returningDate =
          this.dayOfWeek[returnDate.getDay()] +
          ', ' +
          returningMonth +
          '/' +
          returnDate.getDate();

        this.adultsCount = +localStorage.getItem('adultsCount');
        this.childrensCount = +localStorage.getItem('childrensCount');

        this.firebaseService
          .getResource('/flights/' + flightType)
          .subscribe(response => {
            for (let key in response as any) {
              if (
                response[key]['from'] === localStorage.getItem('flyFrom') &&
                response[key]['to'] === localStorage.getItem('flyTo') &&
                response[key][classType] === true
              ) {
                for (let departAirline in response[key]['departureAirlines']) {
                  this.departingFlights.push(
                    response[key]['departureAirlines'][departAirline]
                  );
                  this.stopTimes.push(
                    response[key]['departureAirlines'][departAirline][
                      'stopTimes'
                    ]
                  );
                  this.stopDurations.push(
                    response[key]['departureAirlines'][departAirline][
                      'stopDurations'
                    ]
                  );
                  this.stops.push(
                    response[key]['departureAirlines'][departAirline]['stops']
                  );
                }
                this.stopTimes.forEach((elem, index) => {
                  this.stopTimes[index] = Object.values(elem);
                });
                this.stopDurations.forEach((elem, index) => {
                  this.stopDurations[index] = Object.values(elem);
                });
                this.stops.forEach((elem, index) => {
                  this.stops[index] = Object.values(elem);
                });
                break;
              }
            }
          });
        this.showDepartingFlights = true;
      } else {
        this.showDepartingFlights = false;
      }
    } else if (flightType === 'oneway') {
      if (
        localStorage.getItem('dateFrom') !== null &&
        localStorage.getItem('flyFrom') !== null &&
        localStorage.getItem('flyTo') !== null
      ) {
        let i1 = localStorage.getItem('flyTo').indexOf('(');
        this.departingCity = localStorage.getItem('flyTo').substring(0, i1 - 1);

        let departureMonth = departureDate.getMonth() + 1;
        this.departingDate =
          this.dayOfWeek[departureDate.getDay()] +
          ', ' +
          departureMonth +
          '/' +
          departureDate.getDate();

        this.adultsCount = +localStorage.getItem('adultsCount');
        this.childrensCount = +localStorage.getItem('childrensCount');

        this.firebaseService
          .getResource('/flights/' + flightType)
          .subscribe(response => {
            for (let key in response as any) {
              if (
                response[key]['from'] === localStorage.getItem('flyFrom') &&
                response[key]['to'] === localStorage.getItem('flyTo') &&
                response[key][classType] === true
              ) {
                for (let departAirline in response[key]['departureAirlines']) {
                  this.departingFlights.push(
                    response[key]['departureAirlines'][departAirline]
                  );
                  this.stopTimes.push(
                    response[key]['departureAirlines'][departAirline][
                      'stopTimes'
                    ]
                  );
                  this.stopDurations.push(
                    response[key]['departureAirlines'][departAirline][
                      'stopDurations'
                    ]
                  );
                  this.stops.push(
                    response[key]['departureAirlines'][departAirline]['stops']
                  );
                }
                this.stopTimes.forEach((elem, index) => {
                  this.stopTimes[index] = Object.values(elem);
                });
                this.stopDurations.forEach((elem, index) => {
                  this.stopDurations[index] = Object.values(elem);
                });
                this.stops.forEach((elem, index) => {
                  this.stops[index] = Object.values(elem);
                });
                break;
              }
            }
          });
        this.showDepartingFlights = true;
      } else {
        this.showDepartingFlights = false;
      }
    }
  }

  // output returning flights based on selected departing flight
  showReturnFlights(time) {
    if (this.flightType === 'roundtrip') {
      for (let f in this.departingFlights) {
        if (this.departingFlights[f]['time'] === time) {
          for (let retAirline in this.departingFlights[f][
            'returningAirlines'
          ]) {
            if (
              this.departingFlights[f]['returningAirlines'][retAirline][
                this.classType
              ] === true
            ) {
              this.returningFlights.push(
                this.departingFlights[f]['returningAirlines'][retAirline]
              );
              this.returnStops.push(
                this.departingFlights[f]['returningAirlines'][retAirline][
                  'stops'
                ]
              );
              this.returnstopTimes.push(
                this.departingFlights[f]['returningAirlines'][retAirline][
                  'stopTimes'
                ]
              );
              this.returnstopDurations.push(
                this.departingFlights[f]['returningAirlines'][retAirline][
                  'stopDurations'
                ]
              );
              this.returnStops.forEach((elem, index) => {
                this.returnStops[index] = Object.values(elem);
              });
              this.returnstopDurations.forEach((elem, index) => {
                this.returnstopDurations[index] = Object.values(elem);
              });
              this.returnstopTimes.forEach((elem, index) => {
                this.returnstopTimes[index] = Object.values(elem);
              });

              this.showDepartingFlights = false;
              this.showReturningFlights = true;
              this.showDetailsAndBaggage = false;
            }
          }
          return;
        }
      }
    }
  }

  // used to toggle 'Details and baggage fees' button
  detailsAndBaggageClicked(flight) {
    if (this.showDepartingFlights === true) {
      if (this.flightTime !== flight) {
        this.showDetailsAndBaggage = false;
        for (let f in this.departingFlights) {
          if (this.departingFlights[f]['time'] === flight) {
            this.flightTime = flight;
            this.showDetailsAndBaggage = !this.showDetailsAndBaggage;
          }
        }
      } else {
        this.showDetailsAndBaggage = !this.showDetailsAndBaggage;
      }
    } else if (this.showReturningFlights) {
      if (this.flightTime !== flight) {
        this.showDetailsAndBaggage = false;
        for (let f in this.returningFlights) {
          if (this.returningFlights[f]['time'] === flight) {
            this.flightTime = flight;
            this.showDetailsAndBaggage = !this.showDetailsAndBaggage;
          }
        }
      } else {
        this.showDetailsAndBaggage = !this.showDetailsAndBaggage;
      }
    }
  }

  // when back button is pressed on returning flights screen
  goBack2DepartingFlights() {
    this.returningFlights = [];
    this.returnStops = [];
    this.returnstopDurations = [];
    this.returnstopTimes = [];
    this.showDepartingFlights = true;
    this.showReturningFlights = false;
    this.showDetailsAndBaggage = false;
  }

  // get peoples count
  getPeopleCount(type, event) {
    if (type === 'adult') {
      localStorage.setItem('adultsCount', event);
    } else if (type == 'children') {
      localStorage.setItem('childrensCount', event);
    }
  }
}
