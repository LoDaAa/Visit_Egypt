import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from 'src/app/services/data.service';
import { WebRequestService } from 'src/app/services/web-request.service';
import { SendPasswordResetComponent } from '../send-password-reset/send-password-reset.component';

import { BeginPasswordResetComponent } from './begin-password-reset.component';

fdescribe('BeginPasswordResetComponent', () => {
  let component: BeginPasswordResetComponent;
  let fixture: ComponentFixture<BeginPasswordResetComponent>;
  let service: DataService;
  let webService : WebRequestService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeginPasswordResetComponent ],
      imports : [
        HttpClientModule, 
        RouterModule.forRoot([]), 
        FormsModule,
        RouterTestingModule.withRoutes(
          [{path: 'send_password_reset', component: SendPasswordResetComponent}]
        )],
        providers : [ WebRequestService, DataService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeginPasswordResetComponent);
    component = fixture.componentInstance;
    service = TestBed.get(DataService)
    webService = TestBed.get(WebRequestService)
    localStorage.setItem('foo', 'no reload')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check email input', fakeAsync(() => {
    component.searchData.email = "khaled@gmail.com"
    expect(component.searchData.email).toBe("khaled@gmail.com")
  }));

  it('Check if the function add item of the service is called after clicking on the search user button', () => {
    spyOn(service, 'addItem')
    component.searchData.email = "khaled.garaweenfasvca@gmail.com"
    const button1 = fixture.debugElement.query(By.css('button'))
    button1.nativeElement.enabled = true
    fixture.detectChanges()
    button1.nativeElement.click()
    expect(service.addItem).toHaveBeenCalled();
  });

  it('Check if the email varibale in the service has the same value passed to the add item after clicking on the button of searching User', () => {
    component.searchData.email = "khaled.garaweengasdg@gmail.com"
    const button2 = fixture.debugElement.query(By.css('button'))
    button2.nativeElement.enabled = true
    fixture.detectChanges()
    button2.nativeElement.click()
    expect(service.email).toBe("khaled.garaweengasdg@gmail.com");
  });

  it('Check if the search button is disabled at the loading of the page', fakeAsync(() => {
    const button3 = fixture.debugElement.nativeElement.querySelector('button')
    expect(button3.disabled).toBe(true)
  }));

  it('Search for an existing user after clicking on the button search', function(done) {
    component.searchData.email = "visitEgypt@gmail.com"
    const button4 = fixture.debugElement.query(By.css('button'))
    button4.nativeElement.enabled = true
    fixture.detectChanges()
    button4.nativeElement.click()
    fixture.detectChanges()
    setTimeout(() => {
      expect(component.userFound).toBe(true)
      done();
    }, 1000);
  });

  it('Search for a non existing user', function(done) {
    component.searchData.email = "mercedesz.pusztaimalk@gmail.com"
    component.searchUser()
    fixture.detectChanges()
    setTimeout(() => {
      expect(component.isError).toBe(true)
      done();
    }, 1000);
  });

  it('check if the email is added to the method of the service after searching the user', () => {
    component.searchData.email = "khaled.gmail.com"
    component.searchUser()
    expect(service.getItem()).toBe('khaled.gmail.com');
  });

  it('pass value to the add method of the service and test the get method', () => {
    service.addItem("Khaled")
    expect(service.getItem()).toBe('Khaled');
  });

});
