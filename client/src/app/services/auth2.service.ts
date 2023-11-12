import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth2Service implements CanActivate{

  constructor(private router : Router) { }

  canActivate() : boolean {
    if(this.getAccessToken())
    {
      this.router.navigate(['/aboutEgypt'])
      return false;
    }
    else
    {
      return true;
    }
  }

  getAccessToken(){
    return localStorage.getItem('x-access-token')
  }
}
