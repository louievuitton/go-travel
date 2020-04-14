import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

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
  fromDate: Date;
  toDate: Date;
  airports = [];
  inputField: string;
  mySubscription: any;
  flightType: boolean;
  classType: string;
  mouseovr: boolean = false;
  adultsCount: any;
  cities = [];
  citiesDropdownVisible: boolean = false;
  temp = [];

  // form = new FormGroup({
  //   hotelDest: new FormControl('', Validators.required)
  // });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
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
    this.firebaseService.getAll('hotels').subscribe(res => {
      for (let key in res as any) {
        for (let city in res[key]) {
          this.cities.push(res[key][city]['city']);
          this.cities.sort();
          break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  // switch between Hotels and Flights checkbox
  checkBoxChanged() {
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
    this.fromDate = new Date();
    this.toDate = new Date();
  }

  typeOfFlightChanged() {
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
    }
  }

  toggleMouseOver(mouseover) {
    this.mouseovr = mouseover;
  }

  filterItem(input) {
    this.citiesDropdownVisible = true;
    if (!input) {
      this.temp = this.cities;
    } else {
      this.temp = Object.assign([], this.cities).filter(
        city => city.toLowerCase().indexOf(input.toLowerCase()) > -1
      );
    }
  }

  inputEntered(type, resources: HTMLInputElement) {
    let input = resources.value.toLowerCase();
    if (this.isChecked && type === 'hotel') {
      this.hotelDestination = input;
      this.citiesDropdownVisible = false;
    } else if (this.isChecked === false && type === 'flyFrom') {
      this.airports = [];
      this.inputField = type;
      this.firebaseService
        .getResource('airports/' + input)
        .subscribe(response => {
          for (let key in response as any) {
            this.airports.push(response[key]);
          }
        });
      this.flyingFromDropdownVisible = true;
    } else if (this.isChecked === false && type === 'flyTo') {
      this.airports = [];
      this.inputField = type;
      this.firebaseService
        .getResource('airports/' + input)
        .subscribe(response => {
          for (let key in response as any) {
            this.airports.push(response[key]);
          }
        });
      this.flyingToDropdownVisible = true;
    }
  }

  // when list item is clicked
  itemClicked(type, value) {
    if (type === 'hotel') {
      this.hotelDestination = value;
      this.citiesDropdownVisible = false;
    } else if (type === 'flyFrom') {
      this.flyingFrom = value;
      this.flyingFromDropdownVisible = false;
    } else if (type === 'flyTo') {
      this.flyingTo = value;
      this.flyingToDropdownVisible = false;
    }
  }

  // navigate to page with information passed
  passContent() {
    if (this.isChecked) {
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
    } else {
      if (this.flightType) {
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
      } else {
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

  // get peoples count
  getPeopleCount(type, event) {
    if (type === 'adult') {
      localStorage.setItem('adultsCount', event);
    } else if (type == 'children') {
      localStorage.setItem('childrensCount', event);
    }
  }
}
