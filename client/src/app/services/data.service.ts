import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private userData : any;
  public email : string = '';
  noOfPlaces: EventEmitter<number> = new EventEmitter();
   
  constructor() { }

  getUserData()
  {
    return this.userData;
  }

  setUserData(userData : any)
  {
    this.userData = userData;
  }

  addItem(email : string){
    return this.email = email
  }
  
  getItem(){
    return this.email
  }

  increaseNumberOfPlaces(number : number)
  {
    this.noOfPlaces.emit(number);
  }

  getNumberOfPlaces()
  {
    return this.noOfPlaces;
  }

}
