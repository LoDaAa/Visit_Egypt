import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  zoomIn(src : any)
  {
    let modal = document.getElementById('myModal') as HTMLElement;
    let modalImg = document.getElementById("img01") as HTMLImageElement;

    modal.style.display = "block";
    modalImg.src = src.src;
  }

  zoomOut()
  {
    let modal = document.getElementById('myModal') as HTMLElement;
    let modalImg = document.getElementById("img01") as HTMLImageElement;

    modalImg.className += " out";
    setTimeout(function() {
       modal.style.display = "none";
       modalImg.className = "modal-content";
     }, 400);
  }
  
}
