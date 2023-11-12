import { Component, OnInit} from '@angular/core';
import { trigger, sequence, animate, transition, style } from '@angular/animations';
import * as AOS from 'aos';
import { NavColorService } from 'src/app/nav-color.service';

export const rowsAnimation : any =   trigger('rowsAnimation', [
  transition('void => *', [
    style({ 'height': '*', 'opacity': '0', 'transform': 'translateX(-550px)', 'box-shadow': 'none' }),
    sequence([
      animate('1s ease', style({
        'height': '*',
        'opacity': '.7',
        'transform': 'translateX(0)',
        'box-shadow': 'none',
      })),
      animate('3s ease', style({
        height: '*',
        opacity: '1',
        transform:'translateX(0)',
      })),
    ]),
  ])
]);

@Component({
  selector: 'app-cairo',
  templateUrl: './cairo.component.html',
  styleUrls: ['./cairo.component.scss'],
  animations: [rowsAnimation]
})

export class CairoComponent implements OnInit {

  constructor(public navColor : NavColorService) {this.navColor.navColorToBlack = false; }

   src = "assets/images/Cairo/pyramidsPlace.jpeg";

  ngOnInit(): void {
    AOS.init();
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
