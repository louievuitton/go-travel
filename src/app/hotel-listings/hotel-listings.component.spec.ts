import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelListingsComponent } from './hotel-listings.component';

describe('HotelListingsComponent', () => {
  let component: HotelListingsComponent;
  let fixture: ComponentFixture<HotelListingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelListingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
