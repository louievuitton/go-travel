import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightListingsComponent } from './flight-listings.component';

describe('FlightListingsComponent', () => {
  let component: FlightListingsComponent;
  let fixture: ComponentFixture<FlightListingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightListingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
