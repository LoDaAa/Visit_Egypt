import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { PlanYourTripComponent } from './plan-your-trip.component';

fdescribe('PlanYourTripComponent', () => {
  let component: PlanYourTripComponent;
  let fixture: ComponentFixture<PlanYourTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanYourTripComponent ],
      imports : [
        HttpClientModule, 
        RouterModule.forRoot([]),
        MDBBootstrapModule.forRoot(),
        TranslateModule.forRoot()
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanYourTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check if the function addToYourTrip is called after clicking on the bag icon', () => {
    spyOn(component, 'addToYourTrip')
    const button1 = fixture.debugElement.query(By.css('#addToYourPlaceCairo'))
    button1.nativeElement.click()
    expect(component.addToYourTrip).toHaveBeenCalled();
  });

  it('Check if the login form is shown after calling addToYourTrip by clicking on the bag icon when the user is not logged In', () => {
    localStorage.removeItem('x-access-token')
    expect(component.showLoginForm).toEqual(false);
    const button2 = fixture.debugElement.query(By.css('#addToYourPlaceCairo'))
    button2.nativeElement.click()
    expect(component.showLoginForm).toEqual(true);
  });

  it('Check if the login form is shown after clicking on an image of a place when the user is not logged In', () => {
    localStorage.removeItem('x-access-token')
    expect(component.showLoginForm).toEqual(false);
    const img = fixture.debugElement.query(By.css('#cairoImage'))
    img.nativeElement.click()
    fixture.detectChanges()
    expect(component.showLoginForm).toEqual(true);
  });

  it('checking the boolean variable added is true after successfully adding the place to the trip {PlanYourTripComponent}', function(done) {
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
