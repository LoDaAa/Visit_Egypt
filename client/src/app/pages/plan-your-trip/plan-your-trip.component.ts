import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { animation, style, animate, keyframes, trigger, transition, useAnimation } from '@angular/animations';
import { NavColorService } from 'src/app/nav-color.service';
import places from "../../../assets/local-data/places.json";
import cairoPlaces from "../../../assets/local-data/cairoPlaces.json";
import alexPlaces from "../../../assets/local-data/alexPlaces.json";
import hurghadaPlaces from "../../../assets/local-data/hurghadaPlaces.json";
import sharmPlaces from "../../../assets/local-data/sharmPlaces.json";
import luxorPlaces from "../../../assets/local-data/luxorPlaces.json";
import ancientPlaces from "../../../assets/local-data/ancientPlaces.json";
import beaches from "../../../assets/local-data/beaches.json";
import { AuthService } from 'src/app/services/auth.service';
import { WebRequestService } from 'src/app/services/web-request.service';
import { ModalDirective } from 'angular-bootstrap-md';

export const DEFAULT_TIMING = '0.5';

export const bounceIn = animation(
  animate(
    '{{ timing }}s {{ delay }}s cubic-bezier(0.17, 0.89, 0.24, 1.11)',
    keyframes([
      style({
        opacity: 0,
        transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0)',
        offset: 0,
      }),
      style({
        opacity: 1,
        transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0)',
        offset: 0.6,
      }),
      style({
        opacity: 1,
        transform: 'scale3d(1, 1, 1) translate3d(0,0,0)',
        offset: 1,
      }),
    ])
  ),
  { params: { timing: DEFAULT_TIMING, delay: 0 } }
);

export const bounceOut = animation(
  animate(
    '{{ timing }}s {{ delay }}s cubic-bezier(0.6, 0.72, 0, 1)',
    keyframes([
      style({
        opacity: 1,
        transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0)',
        offset: 0.3,
      }),
      style({
        opacity: 0,
        transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, 500px, 0)',
        offset: 1,
      }),
    ])
  ),
  { params: { timing: DEFAULT_TIMING, delay: 0 } }
);

@Component({
  selector: 'app-plan-your-trip',
  templateUrl: './plan-your-trip.component.html',
  styleUrls: ['./plan-your-trip.component.scss'],
  animations: [
    trigger('bounce', [
      transition(
        'void => *',
        useAnimation(bounceIn, {
          params: { timing: 0.7 },
        })
        ),
      transition(
        '* => void',
        useAnimation(bounceOut, {
          params: { timing: 0.6 },
        })
      ),
    ]),
  ],
})

export class PlanYourTripComponent implements OnInit{

  searchText : any;

  constructor(private navColor: NavColorService, private authService : AuthService, private WebRequestService : WebRequestService) { 
    this.navColor.navColorToBlack = true;
    this.tripIcon = this.navColor.icon; 
    this.placesList = places.places;
    this.cairoPlaces = cairoPlaces.cairoplaces;
    this.alexPlaces = alexPlaces.alexplaces;
    this.hurghadaPlaces = hurghadaPlaces.hurghadaplaces;
    this.sharmPlaces = sharmPlaces.sharmplaces;
    this.luxorPlaces = luxorPlaces.luxorplaces;
    this.ancientPlaces = ancientPlaces.ancientplaces;
    this.beachesList = beaches.beaches;
  }

  showImagesVar : boolean = false;
  showButton : boolean = true;
  showSecondButton : boolean = false;
  showSecondImagesVar : boolean = false;
  all : boolean = true;
  cairo: boolean = true;
  cairoColor : boolean = false;
  alex : boolean = true;
  alexColor : boolean = false;
  hurghada : boolean = true;
  hurghadaColor : boolean = false;
  sharm : boolean = true;
  sharmColor : boolean = false;
  luxor : boolean = true;
  luxorColor : boolean = false;
  ancient : boolean = true;
  ancientColor : boolean = false;
  beaches : boolean = true;
  beachesColor : boolean = false;
  tripIcon : any;
  placesList :any[];
  cairoPlaces : any[];
  alexPlaces : any[];
  hurghadaPlaces : any[];
  sharmPlaces : any[];
  luxorPlaces : any[];
  ancientPlaces : any[];
  beachesList : any[];
  aPlace : any;
  city : String = '';
  clicked : boolean = false;
  showLoginForm : boolean = false;
  addInitialState : boolean = false;
  showFrame : boolean = false;
  @ViewChild('frame', { static: true }) public contentModal: any;
  @ViewChild('frameLogin', { static: true }) public contentLoginModal: any;
  @ViewChild('frameAddPlace', { static: true }) public contentAddPlaceModal: any;
  addStatusText : String = ''
  addState : boolean = true;
  addStatus : String = ''
  place : any;
  added : boolean = false

  ngOnInit() { }

  addToYourTrip(place : any, city : any)
  {
    if(this.authService.getAccessToken() === null)
    {
      this.showLoginForm = true;
      this.contentLoginModal.show();
    }
    else
    {
      this.WebRequestService.checkAddPlaceStatus(place['title']).subscribe(
        res => 
        {
          if(res.length == 0)
          {
            this.WebRequestService.addPlace(place['title'], city).subscribe
            (
              res =>
              {
                this.addStatus = "Successfully Added To Your Trip.";
                this.contentAddPlaceModal.show();
              }
            )
          }
          else
          {
            this.addStatus = "Place has already been added.";
            this.contentAddPlaceModal.show();
          }
        }
      )
    }
  }
  
  checkAddStatus()
  {
    if(this.authService.getAccessToken() === null)
    {
      this.showLoginForm = true;
      this.contentLoginModal.show();
    }
    else
    {
      this.WebRequestService.checkAddPlaceStatus(this.aPlace['title']).subscribe(
        res => 
        {
          this.addStatusText = 'Add To Your Trip'
          this.addState = true;
          this.addInitialState = false;
          if(res.length != 0)
          {
            this.addInitialState = true;
            this.addState = true;
            this.addStatusText = 'Already has been added'
          }
          this.showFrame = true;
          this.contentModal.show()
        }
      )
    }
  }

  show(place : any, city : String)
  {
    this.city = city;
    this.aPlace = place;
  }

  showImages()
  {
    this.showImagesVar = true;
    this.showButton = false;
    this.showSecondButton = true;
  }

  showSecondImages()
  {
    this.showSecondButton = false;
    this.showSecondImagesVar = true;
  }

  showImageDivs(city : string)
  {
    switch(city)
    {
      case city = 'cairo': {
        this.all = false;
        this.cairo = true;
        this.alex = false;
        this.hurghada = false;
        this.luxor = false;
        this.sharm = false;
        this.beaches = false;
        this.ancient = false;
        this.cairoColor = true
        this.alexColor = false;
        this.hurghadaColor = false;
        this.sharmColor = false;
        this.luxorColor = false;
        this.ancientColor = false;
        this.beachesColor = false;
        break;
      }
      case city = 'alex': {
        this.all = false;
        this.cairo = false;
        this.alex = true;
        this.hurghada = false;
        this.luxor = false;
        this.sharm = false;
        this.beaches = false;
        this.ancient = false;
        this.cairoColor = false
        this.alexColor = true;
        this.hurghadaColor = false;
        this.sharmColor = false;
        this.luxorColor = false;
        this.ancientColor = false;
        this.beachesColor = false;
        break;
      }
      case city = 'sharm': {
        this.all = false;
        this.cairo = false;
        this.alex = false;
        this.hurghada = false;
        this.luxor = false;
        this.sharm = true;
        this.beaches = false;
        this.ancient = false;
        this.cairoColor = false
        this.alexColor = false;
        this.hurghadaColor = false;
        this.sharmColor = true;
        this.luxorColor = false;
        this.ancientColor = false;
        this.beachesColor = false;
        break;
      }
      case city = 'luxor': {
        this.all = false;
        this.cairo = false;
        this.alex = false;
        this.hurghada = false;
        this.luxor = true;
        this.sharm = false;
        this.beaches = false;
        this.ancient = false;
        this.cairoColor = false
        this.alexColor = false;
        this.hurghadaColor = false;
        this.sharmColor = false;
        this.luxorColor = true;
        this.ancientColor = false;
        this.beachesColor = false;
        break;

      }
      case city = 'hurghada': {
        this.all = false;
        this.cairo = false;
        this.alex = false;
        this.hurghada = true;
        this.luxor = false;
        this.sharm = false;
        this.beaches = false;
        this.ancient = false;
        this.cairoColor = false
        this.alexColor = false;
        this.hurghadaColor = true;
        this.sharmColor = false;
        this.luxorColor = false;
        this.ancientColor = false;
        this.beachesColor = false;
        break;
      }
      case city = 'ancient': {
        this.all = false;
        this.cairo = false;
        this.alex = false;
        this.hurghada = false;
        this.luxor = false;
        this.sharm = false;
        this.beaches = false;
        this.ancient = true;
        this.cairoColor = false
        this.alexColor = false;
        this.hurghadaColor = false;
        this.sharmColor = false;
        this.luxorColor = false;
        this.ancientColor = true;
        this.beachesColor = false;
        break;
      }
      case city = 'beach': {
        this.all = false;
        this.cairo = false;
        this.alex = false;
        this.hurghada = false;
        this.luxor = false;
        this.sharm = false;
        this.beaches = true;
        this.ancient = false;
        this.cairoColor = false
        this.alexColor = false;
        this.hurghadaColor = false;
        this.sharmColor = false;
        this.luxorColor = false;
        this.ancientColor = false;
        this.beachesColor = true;
        break;
      }
      default: {
        this.all = true;
        this.cairo = true;
        this.alex = true;
        this.hurghada = true;
        this.luxor = true;
        this.sharm = true;
        this.beaches = true;
        this.ancient = true;
        this.cairoColor = false
        this.alexColor = false;
        this.hurghadaColor = false;
        this.sharmColor = false;
        this.luxorColor = false;
        this.ancientColor = false;
        this.beachesColor = false;
      }
    } 
  }

  addToYourTripForTesting()
  {
    this.WebRequestService.addPlaceForTesting(this.place['title'], this.city).subscribe
    (
      res =>
      {
        this.added = true
      },
      err =>
      {
        this.added = false
      }
    )
  }
}
