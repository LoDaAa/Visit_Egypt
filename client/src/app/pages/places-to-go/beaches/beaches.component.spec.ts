import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { BeachesComponent } from './beaches.component';

fdescribe('BeachesComponent', () => {
  let component: BeachesComponent;
  let fixture: ComponentFixture<BeachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeachesComponent ],
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
    fixture = TestBed.createComponent(BeachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check the text of the title in the middle of the component', () => {
    const h2 = fixture.nativeElement.querySelector('h2');
    expect(h2.textContent).toEqual(" Egyptian Beaches");
  });

  it('Check the src image of the first image of the component', () => {
    const img = fixture.nativeElement.querySelector('mdb-carousel-item img');
    expect(img.src).toEqual("http://localhost:9876/assets/images/Beaches/beach.jpeg");
  });

  it('Check that there are 4 images sliding in the component', () => {
    const images = fixture.debugElement.queryAll(By.css('mdb-carousel-item'));
    expect(images.length).toEqual(4);
  });

  it('Check that there are 3 places on the right of the component', () => {
    const rightPlaces = fixture.debugElement.queryAll(By.css('.float-container1'));
    expect(rightPlaces.length).toEqual(3);
  });

  it('Check that there are 3 places on the left of the component', () => {
    const leftPlaces = fixture.debugElement.queryAll(By.css('.float-container2'));
    expect(leftPlaces.length).toEqual(3);
  });

});
