import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavColorService {

  public navColorToBlack: boolean = false;
  public icon: any;

  constructor() { }
}
