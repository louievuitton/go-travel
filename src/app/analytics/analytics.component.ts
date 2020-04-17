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
  articles;
  placeDetails;
  venues:string[] = new Array();
  photos:string[] = new Array();
  placePhoto;
  url;

  public card = new Card({
        imageUrl: "https://www.infragistics.com/angular-demos/assets/images/card/media/ny.jpg",
    });
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getNews().subscribe((data)=>{
      console.log(data);
      this.articles = data['results'];
      for (let num of this.articles) {
        this.venues.push(num.place_id);
        this.apiService.getStats(num.place_id).subscribe((data)=>{
        this.placeDetails = data['result'];
        this.placePhoto = this.placeDetails.photos;
        this.photos.push(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=200&photoreference=${this.placePhoto[0].photo_reference}&key=AIzaSyDSV9VwCxhAK_m0n1qFr2KpJxLpFvhVDfM`);
      });
      }
      console.log(this.venues);
    });
  }

  myFunc(i){
    console.log(this.venues[i]);
    this.apiService.getStats(this.venues[i]).subscribe((data)=>{
    this.placeDetails = data['response'].venue;
    this.placePhoto = data['response'].venue.photos.groups[0].items[0].prefix+300+data['response'].venue.photos.groups[0].items[0].suffix;
    console.log(this.placePhoto);
    });
  }
}
