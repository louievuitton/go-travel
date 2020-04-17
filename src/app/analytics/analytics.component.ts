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
  placePhoto;

  public card = new Card({
        imageUrl: "https://www.infragistics.com/angular-demos/assets/images/card/media/ny.jpg",
    });
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getNews().subscribe((data)=>{
      this.articles = data['response'].groups[0].items;
      for (let num of this.articles) {
        this.venues.push(num.venue.id);
      }
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
