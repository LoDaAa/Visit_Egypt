import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WebRequestService } from 'src/app/services/web-request.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

import { ConfirmPasswordResetComponent } from './confirm-password-reset.component';

fdescribe('ConfirmPasswordResetComponent', () => {
  let component: ConfirmPasswordResetComponent;
  let fixture: ComponentFixture<ConfirmPasswordResetComponent>;
  let webService : WebRequestService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmPasswordResetComponent ],
      imports : [
        HttpClientModule, 
        RouterModule.forRoot([]), 
        FormsModule,
        RouterTestingModule.withRoutes(
          [{path: 'reset_passowrd', component: ResetPasswordComponent}]
        )],
        providers : [ WebRequestService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPasswordResetComponent);
    component = fixture.componentInstance;
    webService = TestBed.get(WebRequestService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check if the verify button is disabled at the loading of the page', fakeAsync(() => {
    const button1 = fixture.debugElement.nativeElement.querySelector('button')
    expect(button1.disabled).toBe(true)
  }));

  it('Check if the verify button is enabled after writing in the input field', fakeAsync(() => {
    const button2 = fixture.debugElement.nativeElement.querySelector('button')
    component.Verify.code = "fasf-asfs-fasf"
    fixture.detectChanges()
    expect(button2.disabled).toBe(false)
  }));
    
  it('Passing a non existing code with different code cirteria would make the isError boolean to be true', function(done) {
    component.Verify.code = "fasf-asfs-fasf-adasd-dasd"
    const button4 = fixture.debugElement.query(By.css('button'))
    button4.nativeElement.enabled = true
    fixture.detectChanges()
    button4.nativeElement.click()
    fixture.detectChanges()
    setTimeout(() => {
      expect(component.isError).toBe(true)
      done();
    }, 1000);
  });

  it('calling the Send code again function and checking my email personally to check if it has been sent and checking the boolean not Sent variable to be falsy', function(done) {
    component.email = "khaled.garawin@yahoo.com"
    const anchor = fixture.debugElement.query(By.css('a'))
    fixture.detectChanges()
    anchor.nativeElement.click()
    fixture.detectChanges()
    setTimeout(() => {
      expect(component.notSent).toBe(false)
      done();
    }, 3000);
  });
});
