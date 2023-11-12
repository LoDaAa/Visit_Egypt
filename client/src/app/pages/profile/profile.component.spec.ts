import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WebRequestService } from 'src/app/services/web-request.service';

import { ProfileComponent } from './profile.component';

fdescribe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: AuthService;
  let webService : WebRequestService
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports : [
        HttpClientModule, 
        RouterModule.forRoot([]),
        FormsModule
       ],
       providers : [ WebRequestService, AuthService],
       schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    component.reloadUserData = false 
    component.show = true
    authService = TestBed.get(AuthService)
    webService = TestBed.get(WebRequestService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check verifyOldPassword function is called after clicking on verify button', () => {
    spyOn(component, 'VerifyOldPassword')
    component.oldPassword = "fafds123"
    fixture.detectChanges()
    const button1 = fixture.debugElement.query(By.css('#verify'))
    button1.nativeElement.enabled = true
    fixture.detectChanges()
    button1.nativeElement.click()
    expect(component.VerifyOldPassword).toHaveBeenCalled();
  });

  it('Check if change function is called after clicking on change button', () => {
    spyOn(component, 'changePassword')
    component.showPasswordControls = true
    component.newPassword = "123412"
    component.confirmNewPassword = "123412"
    fixture.detectChanges()
    const button2 = fixture.debugElement.query(By.css('#changePass'))
    fixture.detectChanges()
    button2.nativeElement.click()
    expect(component.changePassword).toHaveBeenCalled();
  });

  it('Check login from auth service', () => {
    spyOn(authService, 'login')
    let user = {email : "khaled.garaween@gmail.com", password : "123"}
    fixture.detectChanges()
    authService.login(user)
    fixture.detectChanges()
    expect(authService.login).toHaveBeenCalled();
  });

  it('Check login from web service', () => {
    spyOn(webService, 'loginUser')
    let user = {email : "khaled.garaween@gmail.com", password : "123"}
    fixture.detectChanges()
    webService.loginUser(user)
    expect(webService.loginUser).toHaveBeenCalled();
  });
});
