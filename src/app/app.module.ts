import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { MyTravelsComponent } from './my-travels/my-travels.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { ListingsComponent } from './listings/listings.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FirebaseService } from './services/firebase.service';
import { HotelListingsComponent } from './hotel-listings/hotel-listings.component';
import { FlightListingsComponent } from './flight-listings/flight-listings.component';
import { HotelViewComponent } from './hotel-view/hotel-view.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ListingsComponent,
    CheckOutComponent,
    MyTravelsComponent,
    CheckoutSuccessComponent,
    LoginComponent,
    SignupComponent,
    HotelListingsComponent,
    FlightListingsComponent,
    HotelViewComponent
  ],
  imports: [
    BrowserModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NoopAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB5shjix0YQ8dPB9lLwDI08joTJxPAj-H8'
    }),
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'hotels', component: HotelListingsComponent },
      { path: 'flights', component: FlightListingsComponent },
      { path: 'hotel/:city/:name', component: HotelViewComponent },
      { path: 'listings', component: ListingsComponent },
      { path: 'checkout', component: CheckOutComponent },
      { path: 'checkout-success', component: CheckoutSuccessComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'my/travels', component: MyTravelsComponent }
    ])
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule {}
