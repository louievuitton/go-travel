import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AgmCoreModule } from '@agm/core';

@Component({
  selector: 'hotel-view',
  templateUrl: './hotel-view.component.html',
  styleUrls: ['./hotel-view.component.css']
})
export class HotelViewComponent implements OnInit {
  hotelName: string;
  rooms = [];
  params: any;
  lat: number;
  lng: number;
  zoom: number = 17;
  image;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.params = this.route.snapshot.paramMap;

    this.firebaseService
      .getResource('/hotels/' + this.params.get('city').toLowerCase())
      .subscribe(response => {
        for (let key in response as any) {
          if (response[key]['name'] === this.params.get('name')) {
            this.image = response[key]['images']['image1'];
            this.lat = response[key]['latitude'];
            this.lng = response[key]['longitude'];
            this.hotelName = response[key]['name'];
            for (let room in response[key]['rooms']) {
              this.rooms.push(response[key]['rooms'][room]);
            }
            break;
          }
        }
      });
  }

  // reserve button is pressed
  reserveRoom(room) {
    this.router.navigate(['/checkout'], {
      queryParams: {
        city: this.params.get('city'),
        room: room
      }
    });
  }
}
