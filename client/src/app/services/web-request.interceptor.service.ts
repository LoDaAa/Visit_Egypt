import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { empty, Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptorService implements HttpInterceptor{

  refreshing! : boolean;
  accessTokenRefreshed : Subject<any> = new Subject();

  constructor(private auth : AuthService, private route : Router, private webReq : WebRequestService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    req = this.addAuthHeader(req)
    return next.handle(req).pipe(
      catchError((error : HttpErrorResponse) =>{
        if(error.status === 401)
        {
          this.auth.logout()
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              req = this.addAuthHeader(req);
              return next.handle(req);
            }),
            catchError((err : any) => {
              this.auth.logout()
              return empty();
            })
          )
        }
        if(error.status === 404)
        {
          this.route.navigate(['//begin_password_reset'])
        }
        return throwError(error)
      })
    )
  }

  refreshAccessToken(){

    if(this.refreshing){
      return new Observable((observer) =>{
        this.accessTokenRefreshed.subscribe(() =>{
          observer.next();
          observer.complete();
        })
      })
    }
    else
    {
      this.refreshing = true
    return this.webReq.getNewAccessToken().pipe(
      tap(() =>{
        this.refreshing = false
        console.log("Access Token Refreshed!")
        this.accessTokenRefreshed.next(this.refreshing)
      })
    )
    }
    
  }

  addAuthHeader(req : HttpRequest<any>){

    const token = this.auth.getAccessToken();

    if(token){
        return req.clone({
          setHeaders : {
            'x-access-token' : token
          }
        })
    }

    return req;
  }
}

