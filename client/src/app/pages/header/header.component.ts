import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavColorService } from 'src/app/nav-color.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { WebRequestService } from 'src/app/services/web-request.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  public registerData = {name : '', email: '', password: '',  confirmpassword : ''}
  isOpened : boolean = false;
  userName : string = "";
  imageUrl: string | ArrayBuffer | null =  "https://fertilitynetworkuk.org/wp-content/uploads/2017/01/Facebook-no-profile-picture-icon-620x389.jpg";
  @ViewChild('frame', { static: true }) public contentLoginModal: any;
  reloadUserData : boolean = true;
  selectedLang : any;
  noOfPlaces : any = 0;

  constructor( public translate: TranslateService, public navColor : NavColorService, public _authService : AuthService
    , private webRequest : WebRequestService, private dataService : DataService, private router : Router)
  {
     translate.addLangs(['en', 'nl', 'hu']);
     translate.setDefaultLang('en'); 
     this.selectedLang = "en"
     if(localStorage.getItem("language") == 'nl')
     {
      this.translate.use('nl');
      this.variable2 = true;
      this.selectedLang = "nl"
     }
     else if (localStorage.getItem("language") == 'en')
     {
      this.translate.use('en');  
      this.variable2 = false;
      this.selectedLang = "en"
     }
     else if (localStorage.getItem("language") == 'hu')
     {
       this.translate.use('hu');  
       this.selectedLang = "hu"
     }
    this.navColor.icon = document.getElementsByClassName("addToYourTrip");
    this.dataService.getNumberOfPlaces().subscribe( item =>  this.noOfPlaces = this.noOfPlaces + item )
     if(this._authService.getAccessToken())
     {
       this.webRequest.getChosenPlaces().subscribe(
         res =>
              this.noOfPlaces = res.length
       )
     }
  }

  variable2: boolean = false;
  isVisible : boolean = false;

  public ngOnInit(): void {
    if(this.reloadUserData)
    {
      this.webRequest.getUserData().subscribe((userData : any) => {
        this.dataService.setUserData(userData);
        this.userName = userData[0].username;
        if(userData[0].imageURL)
        {
          if(userData[0].imageURL[0] == "h")
          {
            this.imageUrl = userData[0].imageURL;
            console.log(this.imageUrl)
          }
          else
          {
            this.imageUrl = "http://localhost:3000/" + userData[0].imageURL;
          }
        }

      })
    }
  }
   
    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
      let element = document.querySelector('.navbar') as HTMLElement;
      if (window.pageYOffset > element.clientHeight) {
        element.classList.add('navbar-inverse');
      } else {
        element.classList.remove('navbar-inverse');
      }
    }

    useLanguage(lang: string) {  
      location.reload()
      if (lang == 'nl')
      {
          this.variable2 = true;
      }
      else
      {
        this.variable2 = false;
      }
     this.translate.use(lang);  
     localStorage.setItem("language",lang);

    }

    routeAddToYourTrip()
    {
      if(this._authService.getAccessToken() === null)
      {
          this.contentLoginModal.show();
      }
      else
      {
        this.router.navigate(['addToYourTrip'])
      }
    }
}
