import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  flyingFromDropdownVisible: boolean = false;
  flyingToDropdownVisible: boolean = false;
  isChecked: boolean;
  minDate: Date;
  maxDate: Date;
  minDate1: Date;
  maxDate1: Date;
  date: Date;
  hotelDestination: string;
  flyingFrom: string;
  flyingTo: string;
  fromDate;
  toDate;
  airports = [];
  airports1 = [];
  inputField: string;
  mySubscription: any;
  flightType: boolean;
  classType: string;
  mouseovr: boolean = false;
  adultsCount: any;
  cities = [];
  citiesDropdownVisible: boolean = false;
  fromFlightsDropdownVisible: boolean = false;
  toFlightsDropdownVisible: boolean = false;
  temp = [];
  invalidSearch: boolean = false;
  // for input values
  hotelDest: string;
  inputFlyFrom: string;
  inputFlyTo: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private firebaseService: FirebaseService
  ) {
    translate.addLangs(['en', 'fr', 'hi']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|hi/) ? browserLang : 'en');

    // hotels checkbox initially checked
    this.isChecked = true;
    // roundtrip checkbox initially checked
    this.flightType = true;
    // economy initially checked
    this.classType = 'economy';

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
    this.clear();

    this.hotelDestination = '';
    this.flyingFrom = '';
    this.flyingTo = '';
    this.hotelDest = '';
    this.inputFlyFrom = '';
    this.inputFlyTo = '';

    this.firebaseService.getAll('hotels').subscribe(res => {
      for (let key in res as any) {
        for (let city in res[key]) {
          this.cities.push(res[key][city]['city']);
          this.cities.sort();
          break;
        }
      }
    });

    this.firebaseService.getAll('airports').subscribe(response => {
      for (let key in response as any) {
        for (let airport in response[key]) {
          this.airports.push(response[key][airport]['name']);
        }
      }
    });
    this.airports.sort();
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
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

  // switch between Hotels and Flights checkbox
  checkBoxChanged() {
    this.invalidSearch = false;
    this.isChecked = !this.isChecked;
    localStorage.removeItem('adultsCount');
    localStorage.removeItem('childrensCount');
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
    this.fromDate = null;
    this.toDate = null;
  }

  typeOfFlightChanged() {
    this.invalidSearch = false;
    this.flightType = !this.flightType;
  }

  typeOfClassChanged() {
    if (this.classType === 'economy') {
      this.classType = 'firstclass';
    } else if (this.classType === 'firstclass') {
      this.classType = 'economy';
    }
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

  inputBlur() {
    if (this.mouseovr === false) {
      this.flyingFromDropdownVisible = false;
      this.flyingToDropdownVisible = false;
      this.citiesDropdownVisible = false;
      this.fromFlightsDropdownVisible = false;
      this.toFlightsDropdownVisible = false;
    }
  }

  toggleMouseOver(mouseover) {
    this.mouseovr = mouseover;
  }

  filterItem(input, whichInput) {
    if (whichInput === 'hotel') {
      this.citiesDropdownVisible = true;
      if (!input) {
        this.temp = this.cities;
      } else {
        this.temp = Object.assign([], this.cities).filter(
          city => city.toLowerCase().indexOf(input.toLowerCase()) > -1
        );
      }
    } else if (whichInput === 'flyFrom') {
      this.fromFlightsDropdownVisible = true;
      if (!input) {
        this.temp = this.airports;
      } else {
        this.temp = Object.assign([], this.airports).filter(
          airport => airport.toLowerCase().indexOf(input.toLowerCase()) > -1
        );
      }
    } else if (whichInput === 'flyTo') {
      this.toFlightsDropdownVisible = true;
      if (!input) {
        this.temp = this.airports;
      } else {
        this.temp = Object.assign([], this.airports).filter(
          airport => airport.toLowerCase().indexOf(input.toLowerCase()) > -1
        );
      }
    }
  }

  inputEntered(type, resources: HTMLInputElement) {
    let input = resources.value.toLowerCase();
    if (this.isChecked && type === 'hotel') {
      this.hotelDestination = input;
      this.citiesDropdownVisible = false;
    } else if (this.isChecked === false && type === 'flyFrom') {
      this.fromFlightsDropdownVisible = false;
      this.airports1 = [];
      this.inputField = type;
      this.firebaseService
        .getResource('airports/' + input)
        .subscribe(response => {
          for (let key in response as any) {
            this.airports1.push(response[key]);
          }
        });
      this.flyingFromDropdownVisible = true;
    } else if (this.isChecked === false && type === 'flyTo') {
      this.toFlightsDropdownVisible = false;
      this.airports1 = [];
      this.inputField = type;
      this.firebaseService
        .getResource('airports/' + input)
        .subscribe(response => {
          for (let key in response as any) {
            this.airports1.push(response[key]);
          }
        });
      this.flyingToDropdownVisible = true;
    }
  }

  // when list item is clicked
  itemClicked(type, value) {
    if (type === 'hotel') {
      this.hotelDest = value;
      this.hotelDestination = value;
      this.citiesDropdownVisible = false;
    } else if (type === 'flyFrom') {
      this.inputFlyFrom = value;
      this.flyingFrom = value;
      this.fromFlightsDropdownVisible = false;
      this.flyingFromDropdownVisible = false;
    } else if (type === 'flyTo') {
      this.inputFlyTo = value;
      this.flyingTo = value;
      this.toFlightsDropdownVisible = false;
      this.flyingToDropdownVisible = false;
    }
  }

  // navigate to page with information passed
  passContent() {
    if (this.isChecked) {
      if (
        this.hotelDestination === '' ||
        this.fromDate == null ||
        this.toDate == null
      ) {
        this.invalidSearch = true;
      } else {
        this.invalidSearch = false;
        localStorage.setItem('hotelDestination', this.hotelDestination);
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
        this.router.navigate(['/hotels']);
      }
    } else {
      if (this.flightType) {
        if (
          this.flyingFrom === '' ||
          this.flyingTo === '' ||
          this.fromDate == null ||
          this.toDate == null
        ) {
          this.invalidSearch = true;
        } else {
          this.invalidSearch = false;
          localStorage.setItem('flyFrom', this.flyingFrom);
          localStorage.setItem('flyTo', this.flyingTo);
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
          localStorage.setItem('flightType', 'roundtrip');
          localStorage.setItem('classType', this.classType);
          this.router.navigate(['/flights']);
        }
      } else {
        if (
          this.flyingFrom === '' ||
          this.flyingTo === '' ||
          this.fromDate == null
        ) {
          this.invalidSearch = true;
        } else {
          this.invalidSearch = false;
          localStorage.setItem('flyFrom', this.flyingFrom);
          localStorage.setItem('flyTo', this.flyingTo);
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
          localStorage.setItem('flightType', 'oneway');
          localStorage.setItem('classType', this.classType);
          this.router.navigate(['/flights']);
        }
      }
    }
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
