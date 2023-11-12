import { Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import { WebRequestService } from 'src/app/services/web-request.service';

@Component({
  selector: 'app-add-to-your-trip',
  templateUrl: './add-to-your-trip.component.html',
  styleUrls: ['./add-to-your-trip.component.scss']
})

export class AddToYourTripComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  panelOpenState = false;
  cairoPlaces : any = new Array();
  alexandriaPlaces : any = new Array();
  hurghadaPlaces : any = new Array();
  sharmPlaces : any = new Array();
  luxorPlaces : any = new Array();
  ancientPlaces : any = new Array();
  beaches : any = new Array();

  constructor(private webRequest : WebRequestService) { }

  ngOnInit(): void {

   this.webRequest.getChosenPlaces().subscribe(
     res => {
      for(let i = 0; i < res.length; i++)
      {
          if(res[i]._city == 'cairo')
          {
            this.cairoPlaces.push(res[i])
          }
          else if(res[i]._city == 'alex')
          {
            this.alexandriaPlaces.push(res[i])
          }
          else if(res[i]._city == 'hurghada')
          {
            this.hurghadaPlaces.push(res[i])
          }
          else if(res[i]._city == 'sharm')
          {
            this.sharmPlaces.push(res[i])
          }
          else if(res[i]._city == 'luxor')
          {
            this.luxorPlaces.push(res[i])
          }
          else if(res[i]._city == 'ancient')
          {
            this.ancientPlaces.push(res[i])
          }
          else if(res[i]._city == 'beaches')
          {
            this.beaches.push(res[i])
          }
      }
      })
  }

  getUrl(place : any)
  {
    return `http://localhost:3000/${place.imageURL}`;
  }
}
