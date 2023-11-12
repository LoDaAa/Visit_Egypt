import { Component, ElementRef, OnInit, ViewChild, HostListener} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as AOS from 'aos';
import { NavColorService } from 'src/app/nav-color.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebRequestService } from 'src/app/services/web-request.service';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  @ViewChild('videoPlayer')
  videoplayer!: ElementRef;
  variable: boolean = false;
  variable2: boolean = false;
  videoIcon:string = "./assets/images/play.png";
  play:string = "Play";
  validatingForm!: FormGroup;
  isVisible : boolean = false;
  isLoginFrame : boolean = false
  Images = ["", "", "", "", ""]
  UserData = { userEmail : "", message : ""}
  isSuccess : boolean = false;
  showEgyptImg : boolean = true;

  @ViewChild('frame', { static: true }) public contentLoginModal: any;

  constructor(public navColor : NavColorService, private router : Router, private webRequest : WebRequestService, public _authService : AuthService)
   {
    this.navColor.navColorToBlack = false;
  }

  ngOnInit(): void {
    if(localStorage.getItem("language") == "hu")
    {
      this.showEgyptImg = false;
    }
    else
    {
      this.showEgyptImg = true ;
    }
    if(this.router.url === "/aboutEgyptLogin")
    {
      this.isLoginFrame = true
      setTimeout(() => {
        this.contentLoginModal.show();
      }, 1000);
    }
        AOS.init();
        this.validatingForm = new FormGroup({
          loginFormModalEmail: new FormControl('', Validators.email),
          loginFormModalPassword: new FormControl('', Validators.required)
        });
  }

  goToKeyInfoPage()
  {
    this.router.navigate(['/keyInformation']);;
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

  get loginFormModalEmail() {
    return this.validatingForm.get('loginFormModalEmail')!;
  }

  get loginFormModalPassword() {
    return this.validatingForm.get('loginFormModalPassword')!;
  }

  toggleVideo(){
    if(this.play == "Play")
    {
      this.videoplayer.nativeElement.play();
      this.play = "Pause";
      this.videoIcon = "";
      this.variable = true;
    }
    else
    {
      this.videoplayer.nativeElement.pause();
      this.videoIcon = "./assets/images/play.png",
      this.play = "Play"
    }
  }

  SendMessage()
  {
    let email : string | null = this.UserData.userEmail
    if(!email)
    {
      email = localStorage.getItem("email")
    }
    this.webRequest.sendUserEmail(email, this.UserData.message).subscribe(
        res =>
        {
            this.isSuccess = true;
            this.UserData.userEmail = ''
            this.UserData.message = ''
            setTimeout(()=>{  
              this.isSuccess = false;
            }, 2000);
        },
        err =>
        {
            
        }
    )
  }

}
