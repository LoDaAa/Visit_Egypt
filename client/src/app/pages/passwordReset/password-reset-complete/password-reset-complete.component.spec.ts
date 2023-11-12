import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '../../home/home.component';

import { PasswordResetCompleteComponent } from './password-reset-complete.component';

fdescribe('PasswordResetCompleteComponent', () => {
  let component: PasswordResetCompleteComponent;
  let fixture: ComponentFixture<PasswordResetCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordResetCompleteComponent ],
      imports : [
        HttpClientModule, 
        RouterModule.forRoot([]), 
        RouterTestingModule.withRoutes(
          [{path: 'aboutEgyptLogin', component: HomeComponent}]
        )],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check no errors after clicking on the anchor tag that routes back to the home component', fakeAsync(() => {
    const button1 = fixture.debugElement.nativeElement.querySelector('a')
    button1.click();  
    tick();
    expect(true).toBe(true)
  }));
  
});
