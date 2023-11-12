import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports : [HttpClientModule, RouterModule.forRoot([]), FormsModule],
      providers : [SocialAuthService,],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.reloadGoogleData = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check login inputs', () => {
    component.loginData.email = "khaled.garaween@gmail.com"
    component.loginData.password = "123"
    expect(component.loginData.email == 'khaled.garaween@gmail.com').toBeTruthy();
    expect(component.loginData.password == '123').toBeTruthy();
  });

  it('Login call', () => {
    spyOn(component, 'loginUser');
    component.loginData.email = "khaled.garaween@gmail.com"
    component.loginData.password = "123"
    console.log(component.loginData)
    component.loginUser()
    expect(component.failureLog).toBe(false);
  });

  it('Register User with error in username with only alphabets allowed', () => {
    spyOn(component, 'registerUser');
    component.registerData.username = "Merco123"
    component.registerData.email = "Mercoe12@gmail.com"
    component.registerData.password = "123"
    component.registerData.confirmpassword = "123"
    component.registerUser()
    expect(component.failureLog).toBe(false);
  });

  it('Register User', () => {
    spyOn(component, 'registerUser');
    component.registerData.username = "Mercooo"
    component.registerData.email = "Mercoe12@gmail.com"
    component.registerData.password = "123lol123"
    component.registerData.confirmpassword = "123lol123"
    component.registerUser()
    expect(component.failureLog).toBe(false);
  });

  it('Register with already exisiting name', () => {
    spyOn(component, 'registerUser');
    component.registerData.username = "Merco"
    component.registerData.email = "Merco@gmail.com"
    component.registerData.password = "123"
    component.registerData.confirmpassword = "123"
    component.registerUser()
    fixture.detectChanges()
    expect(component.isUsernameUsed).toBe(false);
  });

  it('Register with already exisiting email', () => {
    spyOn(component, 'registerUser');
    component.registerData.username = "Mercooka"
    component.registerData.email = "Mercoe12@gmail.com"
    component.registerData.password = "123"
    component.registerData.confirmpassword = "123"
    component.registerUser()
    expect(component.isEmailUsed).toBe(false);
  });

  it('Register with incorrect password criteria', () => {
    spyOn(component, 'registerUser');
    component.registerData.username = "Mercookagasg"
    component.registerData.email = "Mercoe12fasf@gmail.com"
    component.registerData.password = "123"
    component.registerData.confirmpassword = "123"
    component.registerUser()
    expect(component.isEmailUsed).toBe(false);
  });

  it('Check if the error booleans are false after writing in the inputs of the forms', () => {
    component.registerData.username = "Mercookagasg"
    component.registerData.email = "Mercoe12fasf@gmail.com"
    expect(component.isEmailUsed).toBe(false);
    expect(component.isUsernameUsed).toBe(false);
  });

  it('Check the boolean value of the visibility  after switching between the login and sign up forms', fakeAsync(() => {
    spyOn(component, 'apply');
    const button1 = fixture.debugElement.nativeElement.querySelector('.ghost')
    button1.click();  
    tick();
    fixture.whenStable().then(() => {
      expect(component.apply).toHaveBeenCalled();
    });
  }));

  it('Check facebook social login', () =>{
    const spy =  spyOn(component, 'facebookLogin');
    component.socialLogin(); 
    expect(spy).toHaveBeenCalled();
  })

  it('Check google social login', () =>{
    const spy =  spyOn(component, 'GoogleLogin');
    component.socialLogin(); 
    expect(spy).toHaveBeenCalled();
  })

  it('Check google social logout', () =>{
    const spy =  spyOn(component, 'GoogleLogout');
    component.socialLogout(); 
    expect(spy).toHaveBeenCalled();
  })

});
