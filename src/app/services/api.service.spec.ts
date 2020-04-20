import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';



describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
