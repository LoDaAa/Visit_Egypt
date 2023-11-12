import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { AswanComponent } from './hurghada.component';

describe('AswanComponent', () => {
  let component: AswanComponent;
  let fixture: ComponentFixture<AswanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AswanComponent ],
      imports : [HttpClientModule, RouterModule.forRoot([])],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AswanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
