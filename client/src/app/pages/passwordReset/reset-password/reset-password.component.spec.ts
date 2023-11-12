import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PasswordResetCompleteComponent } from '../password-reset-complete/password-reset-complete.component';

import { ResetPasswordComponent } from './reset-password.component';

fdescribe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordComponent ],
      imports : [
        HttpClientModule, 
        RouterModule.forRoot([]), 
        FormsModule,
        RouterTestingModule.withRoutes(
          [{path: 'password_reset_complete', component: PasswordResetCompleteComponent}]
        )],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Checking if the variable isError would be true after typing not matching passwords', function(done) {
    component.Passwords.newpassword = "123lol123"
    component.Passwords.retypepassword = "123lol1232"
    const button = fixture.debugElement.query(By.css('button'))
    fixture.detectChanges()
    button.nativeElement.click()
    fixture.detectChanges()
    setTimeout(() => {
      expect(component.isError).toBe(true)
      done();
    }, 3000);
  });
  
  it('Checking if the variable success would be true after typing matching passwords', function(done) {
    component.Passwords.newpassword = "123lol123"
    component.Passwords.retypepassword = "123lol123"
    const button = fixture.debugElement.query(By.css('button'))
    fixture.detectChanges()
    button.nativeElement.click()
    fixture.detectChanges()
    setTimeout(() => {
      expect(component.success).toBe(true)
      done();
    }, 3000);
  });
  
});
