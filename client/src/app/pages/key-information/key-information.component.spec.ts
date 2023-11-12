import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { KeyInformationComponent } from './key-information.component';

fdescribe('KeyInformationComponent', () => {
  let component: KeyInformationComponent;
  let fixture: ComponentFixture<KeyInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyInformationComponent ],
      imports : [ TranslateModule.forRoot() ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check the text of the title in the middle of the component', () => {
    const h1Travel = fixture.nativeElement.querySelector('h1');
    expect(h1Travel.textContent).toEqual(" travelEss ");
  });

  it('Check the text of the anchor tag inside the section of the component', () => {
    const h1SwipeDown = fixture.nativeElement.querySelector('section a');
    expect(h1SwipeDown.textContent).toEqual(" Swipe Down ");
  });

  it('Check that we have 10 items to be presented in the page', () => {
    const items = fixture.debugElement.queryAll(By.css('li'));
    expect(items.length).toEqual(21);
  });
});
