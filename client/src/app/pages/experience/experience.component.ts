import { Component, OnInit, ViewChild } from '@angular/core';
import { NavColorService } from 'src/app/nav-color.service';
import { AuthService } from 'src/app/services/auth.service';
import { WebRequestService } from 'src/app/services/web-request.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {

  selectedPlace: any = "Select a place";
  city : string = '';
  places : any;
  isCityClicked : boolean = false
  isPlaceChosen : boolean = false
  comment : string = ''
  comments : any = []
  showLoginForm : boolean = false
  allColor : boolean = false
  cairoColor : boolean = false
  alexColor : boolean = false
  hurghadaColor : boolean = false
  sharmColor : boolean = false
  luxorColor : boolean = false
  ancientColor : boolean = false
  beachesColor : boolean = false
  like = 0
  show : boolean = false;
  
  @ViewChild('frameLogin', { static: true }) public contentLoginModal: any;

  constructor(public navColor : NavColorService, private authService : AuthService, private webServies : WebRequestService) {this.navColor.navColorToBlack = false; }

  ngOnInit(): void {
      this.webServies.getComments().subscribe(
        res => 
        {
          this.allColor = true
          if(res[0] || res == '')
          {
            this.hideloader();
            this.comments = res
          }
          else
          {
            this.comments = []
          }
        }
      )
  }

  hideloader() 
  {
    this.show = true;
  }

  LoadPlacesComments(city : string)
  {
    this.isPlaceChosen = false;
    this.city = city;
    switch(city)
    {
      case city = 'cairo': {
        this.allColor = false;
        this.cairoColor = true
        this.alexColor = false;
        this.hurghadaColor = false;
        this.sharmColor = false;
        this.luxorColor = false;
        this.ancientColor = false;
        this.beachesColor = false;
        this.isCityClicked = true; //for testing
        break;
      }
      case city = 'alex': {
        this.allColor = false;
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
        this.allColor = false;
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
        this.allColor = false;
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
        this.allColor = false;
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
        this.allColor = false;
        this.cairoColor = false
        this.alexColor = false;
        this.hurghadaColor = false;
        this.sharmColor = false;
        this.luxorColor = false;
        this.ancientColor = true;
        this.beachesColor = false;
        break;
      }
      case city = 'beaches': {
        this.allColor = false;
        this.cairoColor = false
        this.alexColor = false;
        this.hurghadaColor = false;
        this.sharmColor = false;
        this.luxorColor = false;
        this.ancientColor = false;
        this.beachesColor = true;
        break;
      }
    } 
    if(this.city == 'all')
    {
        this.places = []
        this.isPlaceChosen = false;
        this.isCityClicked = false;
        this.allColor = true;
        this.cairoColor = false
        this.alexColor = false;
        this.hurghadaColor = false;
        this.sharmColor = false;
        this.luxorColor = false;
        this.ancientColor = false;
        this.beachesColor = false;
        this.webServies.getComments().subscribe(
        res => 
        {
          if(res[0])
          {
            this.comments = res
          }
          else
          {
            this.comments = []
          }
        }
      )
    }
    else
    {
      this.webServies.getCityPlacesForExperience(city).subscribe(
        res =>
        {
            this.places = res
            this.isCityClicked = true;
            this.webServies.getCityComments(city).subscribe(
              res => 
              {
                if(res[0])
                {
                  this.comments = res
                }
                else
                {
                  this.comments = []
                }
              }
            )
        }
      )
    }
  }

  addComment()
  {
    if(this.authService.getAccessToken() === null)
    {
      this.showLoginForm = true;
      this.contentLoginModal.show();
    }
    else
    {
      if(this.city != '' && this.selectedPlace != '' && this.comment != '')
      {
        this.webServies.addComment(this.city, this.selectedPlace, this.comment).subscribe(
          res =>
          {
              this.comment = ""
              this.webServies.getCityComments(this.city).subscribe(
                res => 
                {
                  console.log(res)
                  if(res[0])
                  {
                    this.comments = res
                  }
                }
              )
          }
        )
      }
    }
  }

  LikeUnLike(comment : any, likeUnLike : string)
  {

    if(this.authService.getAccessToken() === null)
    {
      this.showLoginForm = true;
      this.contentLoginModal.show();
    }
    else
    {
      this.webServies.likeUnlikeComment(comment, likeUnLike).subscribe(
        res =>
        {
          if(this.allColor == true)
          {
            this.webServies.getComments().subscribe(
              res => 
              {
                this.allColor = true
                if(res[0])
                {
                  this.comments = res
                }
                else
                {
                  this.comments = []
                }
              }
            )
          }
          else
          {
            this.webServies.getCityComments(this.city).subscribe(
              res => 
              {
                if(res[0])
                {
                  this.comments = res
                }
              }
            )
          }
        }
      )
    }
  }

  loadData()
  {
    this.onPlacesChange()
    this.LoadPlacesComments("")
    this.LikeUnLike("", "")
    this.addComment()
  }

  onPlacesChange() {
    if(this.authService.getAccessToken() === null)
    {
      this.showLoginForm = true;
      this.contentLoginModal.show();
    }
    else
    {
      this.isPlaceChosen = true;
    }
  }
}
