import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { SharmElSheikhComponent } from './sharm-el-sheikh.component';

describe('SharmElSheikhComponent', () => {
  let component: SharmElSheikhComponent;
  let fixture: ComponentFixture<SharmElSheikhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharmElSheikhComponent ],
      imports : [HttpClientModule, RouterModule.forRoot([])],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharmElSheikhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
