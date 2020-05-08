import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Inject
} from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { element } from 'protractor';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'flight-listings',
  templateUrl: './flight-listings.component.html',
  styleUrls: ['./flight-listings.component.css']
})
export class FlightListingsComponent implements OnInit, OnDestroy {
  noTripsAvailable: boolean = false;
  departingFlights = [];
  returningFlights = [];
  airports = [];
  airports1 = [];
  airportsDropdown: boolean = false;
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
  subscription;
  minDate: Date;
  maxDate: Date;
  minDate1: Date;
  maxDate1: Date;
  date: Date;
  fromDate;
  toDate;
  flyFrom: string;
  flyTo: string;
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
  inputFrom: string;
  inputTo: string;
  // need to show on return flights
  departureDur: string;
  departureTime: string;
  departurePrice: number;
  departureStops: string;
  departureName: string;
  temp = [];
  showService: boolean = false;
  invalidSearch: boolean = false;
  // form
  form: FormGroup;
  flightFromInput: FormControl;
  flightToInput: FormControl;
  departureRecords;
  returnRecords;
  page: number = 1;
  contactMethods = [{ en: 'English' }, { fr: 'French' }, { hi: 'Hindi' }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'fr', 'hi']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|hi/) ? browserLang : 'en');
    
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
    this.inputFrom = '';
    this.inputTo = '';
    this.flightFromInput = new FormControl('', [Validators.required]);
    this.flightToInput = new FormControl('', [Validators.required]);
    this.form = new FormGroup({
      flightFrom: this.flightFromInput,
      flightTo: this.flightToInput,
      departingDatePicker: new FormControl('', [Validators.required]),
      returningDatePicker: new FormControl('', [Validators.required])
    });

    this.fetchAirports();

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
      this.clear();
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
    this.subscription.unsubscribe();
  }

  clear() {
    localStorage.removeItem('flyFrom');
    localStorage.removeItem('flyTo');
    localStorage.removeItem('hotelDestination');
    localStorage.removeItem('dateFrom');
    localStorage.removeItem('dateTo');
    localStorage.removeItem('flightType');
    localStorage.removeItem('classType');
    localStorage.removeItem('adultsCount');
    localStorage.removeItem('childrensCount');
  }

  typeOfFlightChanged() {
    if (localStorage.getItem('flightType') === 'roundtrip') {
      this.form.markAsUntouched({ onlySelf: true });
      localStorage.setItem('flightType', 'oneway');
      this.flght = !this.flght;
    } else if (localStorage.getItem('flightType') === 'oneway') {
      this.form.markAsUntouched({ onlySelf: true });
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
    this.dropdownVisible = false;
    this.airports1 = [];
    this.firstInput = whichInput;

    this.subscription = this.firebaseService
      .getResource('airports/' + event.value.toLowerCase())
      .subscribe(response => {
        for (let key in response as any) {
          this.airports1.push(response[key]['name']);
        }
      });

    this.airportsDropdown = true;
  }

  fetchAirports() {
    this.subscription = this.firebaseService
      .getAll('airports')
      .subscribe(response => {
        for (let key in response as any) {
          for (let airport in response[key]) {
            this.airports.push(response[key][airport]['name']);
          }
        }
      });
    this.airports.sort();
  }

  filterItem(input, whichInput) {
    this.firstInput = whichInput;
    this.dropdownVisible = true;
    if (!input) {
      this.temp = this.airports;
    } else {
      this.temp = Object.assign([], this.airports).filter(
        airport => airport.toLowerCase().indexOf(input.toLowerCase()) > -1
      );
    }
  }

  inputBlur() {
    if (this.mouseovr === false) {
      this.dropdownVisible = false;
      this.airportsDropdown = false;
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
      this.inputFrom = airport;
      localStorage.setItem('flyFrom', airport);
      this.airportsDropdown = false;
      this.dropdownVisible = false;
      this.mouseovr = false;
    } else if (this.firstInput === 'to') {
      this.inputTo = airport;
      localStorage.setItem('flyTo', airport);
      this.airportsDropdown = false;
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
      if (
        this.toDate == null ||
        this.fromDate == null ||
        localStorage.getItem('flyFrom') === null ||
        localStorage.getItem('flyTo') === null
      ) {
        this.showDepartingFlights = false;
        this.invalidSearch = true;
      } else {
        this.invalidSearch = false;
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
      }
    } else if (this.flightType === 'oneway') {
      if (localStorage.getItem('dateTo') !== null) {
        localStorage.removeItem('dateTo');
      }
      if (
        this.fromDate == null ||
        localStorage.getItem('flyFrom') === null ||
        localStorage.getItem('flyTo') === null
      ) {
        this.invalidSearch = true;
      } else {
        this.invalidSearch = false;

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
  }

  // if user has entered information from homepage
  showContent(flightType, classType, departureDate, returnDate) {
    this.flyFrom = localStorage.getItem('flyFrom');
    this.flyTo = localStorage.getItem('flyTo');
    if (flightType === 'roundtrip') {
      if (
        localStorage.getItem('dateFrom') !== null &&
        localStorage.getItem('dateTo') !== null &&
        this.flyFrom !== null &&
        this.flyTo !== null
      ) {
        this.noTripsAvailable = false;

        let i1 = this.flyFrom.indexOf('(');
        let i2 = this.flyTo.indexOf('(');
        this.returningCity = this.flyFrom.substring(0, i1 - 1);
        this.departingCity = this.flyTo.substring(0, i2 - 1);

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

        this.subscription = this.firebaseService
          .getResource('/flights/' + flightType)
          .subscribe(response => {
            for (let key in response as any) {
              if (
                response[key]['from'] === this.flyFrom &&
                response[key]['to'] === this.flyTo &&
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
                this.page = 1;
                this.departureRecords = this.departingFlights.length;
                this.showDepartingFlights = true;
                return;
              }
            }
            this.noTripsAvailable = true;
          });
      } else {
        this.showDepartingFlights = false;
      }
    } else if (flightType === 'oneway') {
      if (
        localStorage.getItem('dateFrom') !== null &&
        localStorage.getItem('flyFrom') !== null &&
        localStorage.getItem('flyTo') !== null
      ) {
        this.noTripsAvailable = false;

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

        this.subscription = this.firebaseService
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
                this.page = 1;
                this.departureRecords = this.departingFlights.length;
                this.showDepartingFlights = true;
                return;
              }
            }
            this.noTripsAvailable = true;
          });
      } else {
        this.showDepartingFlights = false;
      }
    }
  }

  // output returning flights based on selected departing flight
  showReturnFlights(time) {
    for (let f in this.departingFlights) {
      if (this.departingFlights[f]['time'] === time) {
        this.departureTime = time;
        this.departureDur = this.departingFlights[f]['departureDuration'];
        this.departureName = this.departingFlights[f]['name'];
        this.departureStops = this.departingFlights[f]['totalStops'];
        if (this.classType === 'economy') {
          this.departurePrice = this.departingFlights[f]['economyPrice'];
        } else if (this.classType === 'firstclass') {
          this.departurePrice = this.departingFlights[f]['firstclassPrice'];
        }
        if (this.flightType === 'roundtrip') {
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
          this.page = 1;
          this.returnRecords = this.returningFlights.length;
          return;
        } else if (this.flightType === 'oneway') {
          this.router.navigate(['/checkout'], {
            queryParams: {
              departureTime: time
            }
          });
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

  navigateToCheckout(time) {
    this.router.navigate(['/checkout'], {
      queryParams: {
        departureTime: this.departureTime,
        returnTime: time
      }
    });
  }

  // when user clicks on wifi, entertainment, and power
  showServices() {
    this.showService = true;
  }

  blurServices() {
    this.showService = false;
  }
}
