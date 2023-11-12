import { Component, OnInit } from '@angular/core';
import { NavColorService } from 'src/app/nav-color.service';

@Component({
  selector: 'app-beaches',
  templateUrl: './beaches.component.html',
  styleUrls: ['./beaches.component.scss']
})
export class BeachesComponent implements OnInit {

  constructor(public navColor : NavColorService) {this.navColor.navColorToBlack = false; }

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
