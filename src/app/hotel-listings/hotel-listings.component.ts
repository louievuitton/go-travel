import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'hotel-listings',
  templateUrl: './hotel-listings.component.html',
  styleUrls: ['./hotel-listings.component.css']
})
export class HotelListingsComponent implements OnInit, OnDestroy {
  hotels = [];
  mySubscription: any;
  lsStatus: boolean;
  minDate: Date;
  maxDate: Date;
  minDate1: Date;
  maxDate1: Date;
  date: Date;
  fromDate: Date;
  toDate: Date;
  cityDestination: string;
  citiesDropdownVisible: boolean = false;
  cities = [];
  temp = [];
  mouseovr: boolean = false;
  subscription;

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
    this.subscription = this.firebaseService.getAll('hotels').subscribe(res => {
      for (let key in res as any) {
        for (let city in res[key]) {
          this.cities.push(res[key][city]['city']);
          this.cities.sort();
          break;
        }
      }
    });

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

    if (localStorage.getItem('hotelDestination') === null) {
      this.clear();
      this.lsStatus = false;
    } else {
      this.showHotels(
        localStorage.getItem('hotelDestination').toLowerCase(),
        new Date(localStorage.getItem('dateFrom')),
        new Date(localStorage.getItem('dateTo'))
      );
      this.lsStatus = true;
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

  inputBlur() {
    if (this.mouseovr === false) {
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

  // when list item is clicked
  itemClicked(value) {
    localStorage.setItem('hotelDestination', value);
    this.citiesDropdownVisible = false;
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

  showHotels(destination, checkInDate, checkOutDate) {
    this.hotels = [];
    this.subscription = this.firebaseService
      .getResource('/hotels/' + destination)
      .subscribe(response => {
        for (let key in response as any) {
          this.hotels.push(response[key]);
          this.cityDestination = response[key]['city'];
        }
      });
  }

  // user enters city destination
  inputEntered(destination: HTMLInputElement) {
    localStorage.setItem('hotelDestination', destination.value);
    this.citiesDropdownVisible = false;
  }

  searchClicked() {
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
    this.showHotels(
      localStorage.getItem('hotelDestination').toLowerCase(),
      new Date(localStorage.getItem('dateFrom')),
      new Date(localStorage.getItem('dateTo'))
    );
    this.lsStatus = true;
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
