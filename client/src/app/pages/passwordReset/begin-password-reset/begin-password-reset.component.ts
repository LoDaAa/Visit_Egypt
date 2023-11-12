import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { WebRequestService } from 'src/app/services/web-request.service';

@Component({
  selector: 'app-begin-password-reset',
  templateUrl: './begin-password-reset.component.html',
  styleUrls: ['./begin-password-reset.component.scss']
})

export class BeginPasswordResetComponent implements OnInit {

  public searchData = {email : ""}
  isError = false
  error = ""
  userFound : boolean = false;
  
  constructor(private webService : WebRequestService, private _router : Router, private data : DataService) { }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
  }

  onInputChange()
  {
    this.isError = false;
  }

  searchUser(){
    this.data.addItem(this.searchData.email)
    this.webService.searchUser(this.searchData).subscribe(
      resp => {
        this.userFound = true;
        this._router.navigate(['/send_password_reset'])
      },
      error => {
               this.error = error.error
               this.isError = true
              }
    )
  }

}
