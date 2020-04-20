import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { IgxCardModule } from 'igniteui-angular';
import { Card } from "./analytics.blueprint";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})

export class AnalyticsComponent implements OnInit {
  restaurants;
  hotels;
  clubs;
  placeDetails;
  restPhotos:string[] = new Array();
  hotelPhotos:string[] = new Array();
  clubsPhotos:string[] = new Array();
  placePhoto;
  url;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getRestaurants().subscribe((data)=>{
      console.log(data);
      this.restaurants = data['results'];
      for (let restaurant of this.restaurants) {
        this.apiService.getStats(restaurant.place_id).subscribe((data)=>{
        this.placeDetails = data['result'];
        this.placePhoto = this.placeDetails.photos;
        this.restPhotos.push(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=200&photoreference=${this.placePhoto[0].photo_reference}&key=AIzaSyDSV9VwCxhAK_m0n1qFr2KpJxLpFvhVDfM`);
      });
      }
    });

    this.apiService.getHotels().subscribe((data)=>{
      this.hotels = data['results'];
      for (let hotel of this.hotels) {
        this.apiService.getStats(hotel.place_id).subscribe((data)=>{
        this.placeDetails = data['result'];
        this.placePhoto = this.placeDetails.photos;
        this.hotelPhotos.push(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=200&photoreference=${this.placePhoto[0].photo_reference}&key=AIzaSyDSV9VwCxhAK_m0n1qFr2KpJxLpFvhVDfM`);
      });
      }
    });

    this.apiService.getClubs().subscribe((data)=>{
      this.clubs = data['results'];
      for (let club of this.clubs) {
        this.apiService.getStats(club.place_id).subscribe((data)=>{
        this.placeDetails = data['result'];
        this.placePhoto = this.placeDetails.photos;
        this.clubsPhotos.push(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=200&photoreference=${this.placePhoto[0].photo_reference}&key=AIzaSyDSV9VwCxhAK_m0n1qFr2KpJxLpFvhVDfM`);
      });
      }
    });

  }

  myFunc(i){
    console.log('gopal');
  }
}
