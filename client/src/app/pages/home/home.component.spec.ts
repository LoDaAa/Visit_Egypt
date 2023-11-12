import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let h1WelcomeTo: HTMLElement;
  let h2Egypt: HTMLElement;
  let firstAnchor: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent],
      imports: [
        HttpClientModule,
        FormsModule,
        TranslateModule.forRoot(),
        RouterModule.forRoot([]), 
         RouterTestingModule.withRoutes([
          { path: '', component: HomeComponent },
        ]),
        MDBBootstrapModule.forRoot()
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check first part of the title in the middle of the component', () => {
    h1WelcomeTo = fixture.nativeElement.querySelector('h1');
    expect(h1WelcomeTo.textContent).toEqual(" Welcome ");
  });

  it('Check second part of the title in the middle of the component', () => {
    h2Egypt = fixture.nativeElement.querySelector('h2');
    expect(h2Egypt.textContent).toEqual(" Egypt");
  });

  it('Check text of the button in the middle of the component', () => {
    firstAnchor = fixture.nativeElement.querySelector('a');
    expect(firstAnchor.textContent).toEqual(" journey ");
  });

  it('Check src images of the component', () => {
    const carouselItemDebugElement = fixture.debugElement.query(By.css('div img'));
    const carouselItemElement = carouselItemDebugElement.nativeElement;
    expect(carouselItemElement.src).toEqual("http://localhost:9876/assets/images/pyramids.jpg");
  });

  it('Check navigation bar title', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toEqual("aboutEgypt");
  });

  it('Check length of the items in lists of components includes nav bars and links of the footer', () => {
    expect(fixture.debugElement.queryAll(By.css('.nav-item')).length).toEqual(8);
   });

  it('Check the font of the description of the About Egypt section', () => {
    expect(fixture.debugElement.query(By.css('.mypost')).nativeElement.style.cssText).toEqual('font-size: 20px;');
   });
  
  it('Check if the video has started after clicking on the button', fakeAsync(() => {
    spyOn(component, 'toggleVideo');
    const button1 = fixture.debugElement.nativeElement.querySelector('.play-icon-box')
    button1.click();  
    tick();
    expect(component.play).toBe("Play");
  }));

  it('Check if the video has started after clicking on the button', fakeAsync(() => {
    spyOn(component, 'toggleVideo');
    const button1 = fixture.debugElement.nativeElement.querySelector('.play-icon-box')
    button1.click();  
    tick();
    expect(component.play).toBe("Play");
  }));

  it('Check Vidoe icon src', fakeAsync(() => {
    expect(component.videoIcon).toBe("./assets/images/play.png");
  }));
});
