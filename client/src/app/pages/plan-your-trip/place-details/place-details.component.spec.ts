import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PlaceDetailsComponent } from './place-details.component';

fdescribe('PlaceDetailsComponent', () => {
  let component: PlaceDetailsComponent;
  let fixture: ComponentFixture<PlaceDetailsComponent>;
  let h2: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceDetailsComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check if the hide button is called after clicking on the X close', () => {
    spyOn(component, 'hide')
    const button1 = fixture.debugElement.query(By.css('button'))
    button1.nativeElement.enabled = true
    fixture.detectChanges()
    button1.nativeElement.click()
    expect(component.hide).toHaveBeenCalled();
  });

  it('Check the title of the tag of the provided place', () => {
    component.place = {'title' : 'Pyramids'}
    fixture.detectChanges()
    h2 = fixture.nativeElement.querySelector('h2');
    fixture.detectChanges()
    expect(h2.textContent).toEqual("Pyramids");
  });

  it('Check the image src of the tag of the provided place', () => {
    component.place = {'title' : 'Pyramids', 'imageUrl' : 'assets/pyramids.jpg'}
    fixture.detectChanges()
    const imgURL = fixture.nativeElement.querySelector('img');
    fixture.detectChanges()
    expect(imgURL.src).toEqual("http://localhost:9876/assets/pyramids.jpg");
  });
});
