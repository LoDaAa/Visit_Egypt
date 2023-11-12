import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GoogleSignInService {

  private auth2! : gapi.auth2.GoogleAuth;
  private subject = new ReplaySubject<gapi.auth2.GoogleUser>(1)
  
  constructor() { 
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '402558925139-rbpibu6eu7v1is8su8pt80f6spcbimin.apps.googleusercontent.com'
      })
    });
  }

  public SignIn()
  {
    this.auth2.signIn({
      scope: 'https://www.googleapis.com/auth/gmail.readonly'
    }).then( user => {
      this.subject.next(user)
    }).catch( () => {
      this.subject.next(null! || undefined)
    })
  }

  public SignOut()
  {
    this.auth2.signOut().then( () => {
      this.subject.next(null! || undefined)
    })
  }

  public observable() : Observable<gapi.auth2.GoogleUser>
  {
      return this.subject.asObservable()
  }
  
}
