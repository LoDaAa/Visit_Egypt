import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from 'src/app/models/places/user.module';
import { DataService } from 'src/app/services/data.service';
import { WebRequestService } from 'src/app/services/web-request.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild('userForm') userForm!: NgForm;
  showPasswordControls : boolean = false;
  userData! : UserData[]
  joinedDate : string = "";
  registerData = {firstName : '', lastName : '', username : '', email: '', phone: '',  location : ''}
  imageUrl: string | ArrayBuffer | null =  "https://fertilitynetworkuk.org/wp-content/uploads/2017/01/Facebook-no-profile-picture-icon-620x389.jpg";
  images : any ;
  firstNameProf : string = ""
  lastNameProf : string = ""
  profileName : string = ""
  imgProf: string | ArrayBuffer | null =  "https://fertilitynetworkuk.org/wp-content/uploads/2017/01/Facebook-no-profile-picture-icon-620x389.jpg";
  successUpdate : boolean = false;
  imgBigFailure : boolean = false;
  imgFailure : boolean = false;
  oldPassword : string = "";
  oldPassFailure : boolean = false;
  newPassword : string = '';
  nullNewPassword : boolean = false;
  samePassword : boolean = false;
  confirmNewPassword : string = '';
  successPassChange : boolean = false;
  fd = new FormData();
  validateData = {firstName : '', lastName : '', username : '', email: '', phone: '',  location : ''}
  imageSuccess : boolean = false;
  reloadUserData : boolean = true
  show : boolean = false;
  loggedInAPI : boolean = false;

  constructor(private webRequest : WebRequestService, private dataService : DataService, private router : Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("email"))
    {
        this.loggedInAPI = true
    }
    if(this.reloadUserData)
    {
      this.webRequest.getUserData().subscribe((userData : any) => {
        if(userData.length > 0)
        {
          this.joinedDate = userData[0].joinedDate;
          this.registerData.username = userData[0].username;
          this.registerData.email = userData[0].email;
          this.registerData.phone = userData[0].phone;
          this.registerData.location = userData[0].location;
          this.registerData.firstName = userData[0].firstName;
          this.registerData.lastName = userData[0].lastName;
          this.validateData.username = userData[0].username;
          this.validateData.email = userData[0].email;
          this.validateData.phone = userData[0].phone;
          this.validateData.location = userData[0].location;
          this.validateData.firstName = userData[0].firstName;
          this.validateData.lastName = userData[0].lastName;
          if(userData[0].imageURL)
          {
            if(userData[0].imageURL[0] == "h")
            {
              this.imageUrl = userData[0].imageURL;
              this.imgProf =  userData[0].imageURL;
            }
            else
            {
              this.imageUrl = "http://localhost:3000/" + userData[0].imageURL;
              this.imgProf = "http://localhost:3000/" + userData[0].imageURL;
            }
          }
          this.profileName = userData[0].username;
          this.firstNameProf = userData[0].firstName;
          this.lastNameProf = userData[0].lastName;
          this.show = true
        }
        })
    }
  }

selectImage(event: any) {
  this.imgBigFailure = false
  if(event.target.files.length > 0)
  {
      const file = event.target.files[0];
      const MAX_SIZE = 5242880;
      if(event.target.files[0].size > MAX_SIZE)
      {
          this.imgBigFailure = true
      }
      this.images = file;
      if (file) {        
        const reader = new FileReader();
        reader.readAsDataURL(file);
    
        reader.onload = event => {
          this.imageUrl = reader.result;
        };
      }
      this.userForm.form.markAsDirty()
  }
}

updateProfile()
  {
      if(this.images)
      {
        const formData = new FormData();
        formData.append('imgFile', this.images);
        this.webRequest.uploadImg(formData).subscribe()
      }

      if (this.registerData.username  === this.validateData.username && this.registerData.email === this.validateData.email &&
        this.registerData.phone === this.validateData.phone && this.registerData.location  === this.validateData.location &&
        this.registerData.firstName  === this.validateData.firstName && this.registerData.lastName  === this.validateData.lastName && this.images)
      {
          this.imageSuccess = true;
          setTimeout(()=>{  
            this.imageSuccess = false;
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/profile'])
          }, 1000);
      }
      else
      {
        this.webRequest.updateUserData(this.registerData).subscribe((res) =>{
          this.successUpdate = true;
          setTimeout(()=>{  
            this.successUpdate = false;
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/profile'])
          }, 1000);
    
        })
      }
  }

  clearOldNewPasserror()
  {
    this.oldPassFailure = false;
    this.samePassword = false;
    this.nullNewPassword = false;
    this.confirmNewPassword = '';
  }

  VerifyOldPassword()
  {
      this.webRequest.verifyUserPass(this.registerData.email, this.oldPassword).subscribe(
        res => {
        this.showPasswordControls = true;
      },
      err =>
      {
          this.oldPassFailure = true;
      }
      )
  }

  changePassword()
  {
    this.webRequest.changeUserPass(this.newPassword).subscribe(
      res => {
      this.successPassChange = true;
      setTimeout(()=>{  
        this.successPassChange = false;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/profile'])
      }, 1000);
    },
    err =>
    {
      if(err.error.errorType === 'nullPassword')
      {
        this.nullNewPassword = true;
      }
      else if(err.error.errorType === 'sameOldpassword')
      {
        this.samePassword = true;
      }
    }
    )
  }

}
