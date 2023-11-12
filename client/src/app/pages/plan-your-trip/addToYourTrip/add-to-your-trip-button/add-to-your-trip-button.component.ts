import { Component, Input, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { DataService } from 'src/app/services/data.service';
import { WebRequestService } from 'src/app/services/web-request.service';

@Component({
  selector: 'app-add-to-your-trip-button',
  templateUrl: './add-to-your-trip-button.component.html',
  styleUrls: ['./add-to-your-trip-button.component.scss']
})

export class AddToYourTripButtonComponent implements OnInit {
  @Input() place!: any;
  @Input() city!: any;
  @Input() addState!: any;
  @Input() addInitialState!: any;
  @Input() addStatusText!: any;
  @Input() frame! : MDBModalRef;
  added : boolean = false

  constructor(private WebRequestService : WebRequestService, private dataService : DataService) { }

  ngOnInit(): void {
  }
 
  addToYourTrip()
  {
    this.WebRequestService.addPlace(this.place['title'], this.city).subscribe
    (
      res =>
      {
        this.dataService.increaseNumberOfPlaces(1);
        this.addStatusText = 'Added';
        this.addInitialState = true;
        this.addState = false;
        this.added = true
        setTimeout(()=>{  
          this.frame.hide();
        }, 1000);
        setTimeout(()=>{  
          this.addState = true;
          this.addInitialState = false;
          this.addStatusText = 'Add To Your Trip';
        }, 1500);
      },
      err =>
      {
        this.added = false
      }
    )
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
