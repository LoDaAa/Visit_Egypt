import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmPasswordResetComponent } from '../confirm-password-reset/confirm-password-reset.component';

import { SendPasswordResetComponent } from './send-password-reset.component';

fdescribe('SendPasswordResetComponent', () => {
  let component: SendPasswordResetComponent;
  let fixture: ComponentFixture<SendPasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPasswordResetComponent ],
      imports : [
        HttpClientModule, 
        RouterModule.forRoot([]), 
        RouterTestingModule.withRoutes(
          [{path: 'confirm_pin_reset', component: ConfirmPasswordResetComponent}]
        )],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checking the boolean variable sent is true after successfully send an email', function(done) {
    component.email = "khaled.garawin@yahoo.com"
    fixture.detectChanges()
    component.sendEmail()
    fixture.detectChanges()
    setTimeout(() => {
      expect(component.sent).toBe(true)
      done();
    }, 3000);
  });
});
