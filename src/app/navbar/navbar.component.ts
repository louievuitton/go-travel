import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private route: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {}

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('email');
  }

  login() {
    if (this.router.url.includes('flights')) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: 'flights' }
      });
    } else if (this.router.url.includes('hotel')) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: 'hotels' }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  signup() {
    if (this.router.url.includes('flights')) {
      this.router.navigate(['/signup'], {
        queryParams: { returnUrl: 'flights' }
      });
    } else if (this.router.url.includes('hotel')) {
      this.router.navigate(['/signup'], {
        queryParams: { returnUrl: 'hotels' }
      });
    } else {
      this.router.navigate(['/signup']);
    }
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
