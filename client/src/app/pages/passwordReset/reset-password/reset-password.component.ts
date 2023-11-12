import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from 'src/app/services/web-request.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  Passwords = { newpassword : "", retypepassword : ""}
  isError = false
  error = ""
  success = false

  constructor(private route : Router, private webService : WebRequestService) { }

  ngOnInit(): void {
    this.webService.getEmail().subscribe()
  }

  onChange()
  {
      this.isError = false
      this.Passwords.retypepassword = ''
  }

  onChange2()
  {
      this.isError = false
  }

  reset(){
    this.webService.resetPassword(this.Passwords)
    .subscribe(
      resp => {
        this.success = true
        setTimeout(()=>{  
          this.route.navigate(['/password_reset_complete'])
        }, 2000);
     
    },
      error => {
               this.error = error.error
               this.isError = true
              }
    )
  }
}
