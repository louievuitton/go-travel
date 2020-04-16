import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_KEY = '5918c69d4a3842c7967b36c95bbfe834';

  CLIENT_ID = 'WO0WHD3120B5ZBGYDPZI2HCRBVMBI3CWI4JPAGZSYPTHD5UD';
  CLIENT_SECRET = 'U20MT5S2HK5SPXTLQ1DMFTYRAQ1NVUJ4IABQH4LJFXOUT20W';

  TECH_CRUNCH = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${this.API_KEY}`;
  FOUR_SQUARE = `https://api.foursquare.com/v2/venues/explore/?near=Shibuya&venuePhotos=1&section=food&client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}&v=20200415`;
  FOUR_SQUARE2 = `https://api.foursquare.com/v2/venues/explore/?near=san jose&venuePhotos=1&section=topPicks&client_id=WO0WHD3120B5ZBGYDPZI2HCRBVMBI3CWI4JPAGZSYPTHD5UD&client_secret=U20MT5S2HK5SPXTLQ1DMFTYRAQ1NVUJ4IABQH4LJFXOUT20W&v=20200415&sortByDistance=1&radius=20000`;
  constructor(private httpClient: HttpClient) { }
  public getNews(){

      return this.httpClient.get(this.FOUR_SQUARE2);
    }
}
