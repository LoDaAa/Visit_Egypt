import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { RouterModule } from '@angular/router';
import { CairoComponent } from './cairo.component';

describe('CairoComponent', () => {
  let component: CairoComponent;
  let fixture: ComponentFixture<CairoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CairoComponent ],
      imports : [HttpClientModule, RouterModule.forRoot([]), BrowserAnimationsModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CairoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
