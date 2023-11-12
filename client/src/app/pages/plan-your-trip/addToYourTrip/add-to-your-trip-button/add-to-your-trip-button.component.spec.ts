import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AuthService } from 'src/app/services/auth.service';

import { AddToYourTripButtonComponent } from './add-to-your-trip-button.component';

fdescribe('AddToYourTripButtonComponent', () => {
  let component: AddToYourTripButtonComponent;
  let fixture: ComponentFixture<AddToYourTripButtonComponent>;
  let authService : AuthService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToYourTripButtonComponent ],
      imports : [
        HttpClientModule, 
        RouterModule.forRoot([]),
        MDBBootstrapModule.forRoot()
      ],
      providers : [ AuthService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToYourTripButtonComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService)
    localStorage.setItem('x-access-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTc3MTBiOGIyMWViMzJjZGMxZGFlYWUiLCJpYXQiOjE2Mzc0NTI5MjQsImV4cCI6MTYzNzQ1MzgyNH0.3yhMEDtDt8wwVK4Ug7olM_2_ZmdU8YX9STNDAb2UCpY')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checking the boolean variable added is true after successfully adding the place to the trip', function(done) {
    expect(component.added).toBe(false)
    component.place = {'title' : 'Pyramids'}
    component.city = 'cairo'
    fixture.detectChanges()
    component.addToYourTripForTesting()
    fixture.detectChanges() 
    setTimeout(() => {
      expect(component.added).toBe(true)
      done();
    }, 1000);
  });


});
