import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { PlacesToGoComponent } from './places-to-go.component';

fdescribe('PlacesToGoComponent', () => {
  let component: PlacesToGoComponent;
  let fixture: ComponentFixture<PlacesToGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacesToGoComponent ],
      imports : [
        HttpClientModule, 
        RouterModule.forRoot([]),
        MDBBootstrapModule.forRoot()
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesToGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check that there are 5 places to visit in the component', () => {
    const places = fixture.debugElement.queryAll(By.css('.column'));
    expect(places.length).toEqual(5);
  });

  it('Check the style of the div of the first place cairo', () => {
    const place = fixture.nativeElement.querySelector('.view');
    expect(place.style.cssText).toEqual("width: 100% !important; height: 770px !important;");
  });

  it('Check the src image of the first place cairo', () => {
    const img = fixture.nativeElement.querySelector('div img');
    expect(img.src).toEqual("http://localhost:9876/assets/images/CairoBackground3.jpeg");
  });

});
