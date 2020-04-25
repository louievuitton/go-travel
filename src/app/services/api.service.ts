import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_KEY = '5918c69d4a3842c7967b36c95bbfe834';
  CLIENT_ID = 'WO0WHD3120B5ZBGYDPZI2HCRBVMBI3CWI4JPAGZSYPTHD5UD';
  CLIENT_SECRET = 'U20MT5S2HK5SPXTLQ1DMFTYRAQ1NVUJ4IABQH4LJFXOUT20W';
  GOOGLE_API = 'AIzaSyDSV9VwCxhAK_m0n1qFr2KpJxLpFvhVDfM';

  V = 20200416;

  TECH_CRUNCH = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${this.API_KEY}`;
  FOUR_SQUARE = `https://api.foursquare.com/v2/venues/explore/?near=Shibuya&venuePhotos=1&section=food&client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}&v=20200415`;
  FOUR_SQUARE_VENUE = `https://api.foursquare.com/v2/venues/explore/?near=los angeles&section=topPicks&client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}&v=${this.V}&sortByDistance=1&radius=20000`;
  GOOGLE_PLACE_RESTAURANTS = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top restaurants in los angeles&key=${this.GOOGLE_API}`;
  GOOGLE_PLACE_HOTELS = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top hotels in los angeles&key=${this.GOOGLE_API}`;
  GOOGLE_PLACE_CLUBS = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top night clubs in los angeles&key=${this.GOOGLE_API}`;

  constructor(private httpClient: HttpClient) {}
  public getRestaurants(location) {
    return this.httpClient.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top restaurants in ${location}&key=${this.GOOGLE_API}`
    );
  }

  public getHotels(location) {
    return this.httpClient.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top hotels in ${location}&key=${this.GOOGLE_API}`
    );
  }

  public getClubs(location) {
    return this.httpClient.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top night clubs in ${location}&key=${this.GOOGLE_API}`
    );
  }

  public getStats(placeId) {
    return this.httpClient.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.GOOGLE_API}`
    );
  }
}
