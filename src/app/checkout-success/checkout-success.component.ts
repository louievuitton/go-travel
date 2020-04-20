import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.css']
})
export class CheckoutSuccessComponent implements OnInit {
  dayOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
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
  params;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.params = this.route.snapshot.queryParamMap;
  }

  get currentUser() {
    return localStorage
      .getItem('currentUser')
      .substr(0, localStorage.getItem('currentUser').indexOf(' '));
  }

  get cityDestination() {
    if (this.params.get('confirmation') === 'flight') {
      return localStorage
        .getItem('flyTo')
        .substr(0, localStorage.getItem('flyTo').indexOf('('));
    }
  }

  get departingDate() {
    let departureDate = new Date(localStorage.getItem('dateFrom'));
    let departureMonth = departureDate.getMonth();
    return (
      this.dayOfWeek[departureDate.getDay()] +
      ', ' +
      this.months[departureMonth] +
      ' ' +
      departureDate.getDate()
    );
  }

  get hotelName() {
    if (this.params.get('confirmation') === 'hotel') {
      return this.params.get('hotel');
    }
  }
}
