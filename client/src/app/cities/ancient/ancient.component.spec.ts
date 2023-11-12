import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { AncientComponent } from './ancient.component';

describe('AncientComponent', () => {
  let component: AncientComponent;
  let fixture: ComponentFixture<AncientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AncientComponent ],
      imports : [HttpClientModule, RouterModule.forRoot([])],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AncientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
