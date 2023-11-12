import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from 'src/app/services/web-request.service';

@Component({
  selector: 'app-confirm-password-reset',
  templateUrl: './confirm-password-reset.component.html',
  styleUrls: ['./confirm-password-reset.component.scss']
})
export class ConfirmPasswordResetComponent implements OnInit {

    code : string = ""
    Verify = {code : ""}
    isError = false
    error = ""
    email = ""
    isSentBack : boolean = false
    notSent : boolean = true
    
  constructor(private route : Router, private webService : WebRequestService) { }

  ngOnInit(): void {
    this.webService.getEmail().subscribe(
      res =>
      {
         this.email = res.email
      },
      err =>
      {
      }
    )
  }

  SendCodeAgain()
  {
    this.webService.sendEmail(this.email)
    .subscribe(
      res => {
                this.isSentBack = true
                this.notSent = false;
                setTimeout(() => {
                  this.isSentBack = false
                }, 2000);
              },
      error => {
                 this.notSent = true
               }
  )
  }

  onChange()
  {
    this.isError = false
    this.isSentBack = false
  }

  verify(){
    this.webService.sendCode(this.Verify.code)
    .subscribe(
      resp => {
        console.log(resp)
        this.route.navigate(['/reset_password'])
    },
      error => {
               this.error = error.error
               this.isError = true
              }
    )
  }

}
