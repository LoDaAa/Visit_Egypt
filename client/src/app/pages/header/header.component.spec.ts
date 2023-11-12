import {  HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports : [
                  HttpClientModule,
                  RouterModule.forRoot([]),
                  MDBBootstrapModule.forRoot(),
                  TranslateModule.forRoot()
                ],
      providers : [ { provide: TranslateService, useClass: TranslateServiceStub }],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

   class TranslateServiceStub
   {
      addLangs()
      {
        
      }
      setDefaultLang()
      {

      }
      use()
      {
        
      }
      get()
      {

      }
    }

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.reloadUserData = false;
    fixture.detectChanges();
  });
});
