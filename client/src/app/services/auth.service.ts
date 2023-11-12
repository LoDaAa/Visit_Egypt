import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http'
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { WebRequestService } from './web-request.service';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements CanActivate{

  constructor(private router : Router, private webReq : WebRequestService) { }
  
  canActivate() : boolean {
    if(this.getAccessToken() === null)
    {
      this.router.navigate(['/aboutEgypt'])
      return false;
    }
    else
    {
      return true;
    }
  }

  
  login(user : any){
    return this.webReq.loginUser(user).pipe(
      shareReplay(),
      tap((res : HttpResponse<any>) =>{
          this.setSession(res.body._id, res.headers.get('x-access-token') as any, res.headers.get('x-refresh-token') as any);
      })
    )
  }

  register(user : any){
    return this.webReq.registerUser(user).pipe(
      shareReplay()
    )
  }

  logout(){
    localStorage.removeItem("email")
    this.removeSession();
    if(this.getAccessToken() === null && this.router.url == '/profile' || this.router.url == '/addToYourTrip')
    {
      this.router.navigate(['/aboutEgypt'])
    }
    else
    {
      window.location.reload()
    }
  }
  
  getAccessToken(){
    return localStorage.getItem('x-access-token')
  }

  private removeSession()
  {
    localStorage.removeItem('userId');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  private setSession(userId : string, accessToken : string, refreshToken : string){
    setTimeout(()=>{  
      localStorage.setItem('userId', userId);
      localStorage.setItem('x-access-token', accessToken);
      localStorage.setItem('x-refresh-token', refreshToken)
    }, 1000);   
  }

}
