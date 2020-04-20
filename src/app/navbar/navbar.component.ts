import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // this.clear();
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('email');
  }

  get currentUser() {
    return localStorage.getItem('currentUser');
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
}
