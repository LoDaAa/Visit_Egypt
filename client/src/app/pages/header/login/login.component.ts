import { ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Input } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { WebRequestService } from 'src/app/services/web-request.service';
import { GoogleSignInService } from 'src/app/services/google-sign-in.service';
import { SocialAuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  
  @ViewChild('userForm') userForm! : NgForm;
  @ViewChild('loginForm') loginForm! : NgForm;

  isVisible : boolean = false;
  isUsernameUsed : boolean = false;
  isEmailUsed : boolean = false;
  public registerData = {username : '', email: '', password: '',  confirmpassword : ''}
  public successReg = false;
  public successLog = false;
  public failureLog = false;
  public loginData = {email: '', password: ''}
  user! : gapi.auth2.GoogleUser;
  socialUser!: SocialUser;
  isLoggedin: boolean = false;
  successLogTest : boolean = false
  reloadGoogleData : boolean = true
  
  @Input() frame! : MDBModalRef;
  
  constructor(private _auth : AuthService, private route : Router, private webService : WebRequestService,
              private googleSerive : GoogleSignInService, private ref : ChangeDetectorRef, private socialAuthService: SocialAuthService) { }

  ngOnInit()
  {
      this.googleSerive.observable().subscribe( user =>
        {
          this.user = user
          this.ref.detectChanges()
          if(this.user != null)
          {
            localStorage.setItem("email" , this.user.getBasicProfile().getEmail())
            this.webService.SignInWithGoogleUrl(this.user.getBasicProfile().getEmail(),
                           this.user.getBasicProfile().getGivenName(),
                           this.user.getBasicProfile().getImageUrl()
                           ).subscribe(
              res =>
              {
                    localStorage.setItem('userId', res._id);
                    localStorage.setItem('x-access-token', res.accessToken);
                    localStorage.setItem('x-refresh-token', res.refreshToken)
                    this.frame.hide();
                    window.location.reload()
              }
            )
          }
        })

      this.socialAuthService.authState.subscribe((user) => {
        this.socialUser = user;
        this.isLoggedin = (user != null);
        localStorage.setItem("email" , this.socialUser.email)
        this.webService.SignInWithFacebookUrl(this.socialUser.email,
          this.socialUser.name,
          this.socialUser.photoUrl,
                         ).subscribe(
            res =>
            {
                  localStorage.setItem('userId', res._id);
                  localStorage.setItem('x-access-token', res.accessToken);
                  localStorage.setItem('x-refresh-token', res.refreshToken)
                  this.frame.hide();
                  window.location.reload()
            }
          )
      });
  }

  change(){
      this.isUsernameUsed = false;
      this.isEmailUsed = false;
    }

    changeLogin()
    {
      this.failureLog = false;
    }

  apply(button : string)
  {
  if(button == "signUp")
  {
   this.isVisible = true;
  }
  else
  {
   this.isVisible = false;
  }
  }

  registerUser(){  
    this._auth.register(this.registerData)
    .subscribe(
      res => {
        console.log(res);
        this.successReg = true
        this.isUsernameUsed = false;
        this.isEmailUsed = false;       
        setTimeout(()=>{  
          this.isVisible = false;
          this.successReg = false;
          this.userForm.reset();
        }, 1000);
    },
      error => {
        if(error.error.errorType == "username")
        {
          this.isUsernameUsed = true;
        }
        else if (error.error.errorType == "email")
        {
          this.isEmailUsed = true;
        }
      }
  )
}

loginUser(){
  this._auth.login(this.loginData)
  .subscribe(
    resp => {
      this.successLogTest = true
      this.successLog = true;
      setTimeout(()=>{  
        this.frame.hide();
        this.loginForm.reset();
        this.successLog = false;
        this.failureLog = false;
        window.location.reload()
      }, 1000);
      
  },
    error => {
             this.failureLog = true
            }
  )
}

socialLogin()
{
  this.facebookLogin()
  this.GoogleLogin()
}

socialLogout()
{
  this.GoogleLogout()
}

facebookLogin()
{
  this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
}

GoogleLogin()
{
  this.googleSerive.SignIn()
}

GoogleLogout()
{
  this.googleSerive.SignOut()
}

}
