import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { LuxorComponent } from './luxor.component';

describe('LuxorComponent', () => {
  let component: LuxorComponent;
  let fixture: ComponentFixture<LuxorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuxorComponent ],
      imports : [HttpClientModule, RouterModule.forRoot([])],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LuxorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
