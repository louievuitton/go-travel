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
  venues:string[] = new Array();
  public card = new Card({
        imageUrl: "https://www.infragistics.com/angular-demos/assets/images/card/media/ny.jpg",
    });
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getNews().subscribe((data)=>{
      console.log(data);
      this.articles = data['response'].groups[0].items;
      for (let num of this.articles) {
        this.venues.push(num.venue.id);
      }
    });
  }
}
