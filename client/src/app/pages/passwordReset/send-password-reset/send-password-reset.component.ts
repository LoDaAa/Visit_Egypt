import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { WebRequestService } from 'src/app/services/web-request.service';

@Component({
  selector: 'app-send-password-reset',
  templateUrl: './send-password-reset.component.html',
  styleUrls: ['./send-password-reset.component.scss']
})
export class SendPasswordResetComponent implements OnInit {
  email : string = ''
  button = "Next"
  sent : boolean = false
  
  constructor(private webService : WebRequestService, private _router : Router) { }

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

  sendEmail(){
    this.button = "Sending.."
    this.webService.sendEmail(this.email)
      .subscribe(
        res => {
          this.button = "Sending"
          this.sent = true
          this._router.navigate(['/confirm_pin_reset'])
      },
        error => {
          this.sent = false
                }
    )
  }

}
