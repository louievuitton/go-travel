import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})

export class AnalyticsComponent implements OnInit {
  articles;
  constructor(private apiService: ApiService) { }

  ngOnInit() {

    this.apiService.getNews().subscribe((data)=>{
      console.log(data);
      this.articles = data['response'].groups[0].items;
    });
  }
}
