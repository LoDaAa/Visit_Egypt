import { Component, OnInit } from '@angular/core';
import { NavColorService } from 'src/app/nav-color.service';

@Component({
  selector: 'app-places-to-go',
  templateUrl: './places-to-go.component.html',
  styleUrls: ['./places-to-go.component.scss']
})
export class PlacesToGoComponent implements OnInit {

  constructor(public navColor : NavColorService) {this.navColor.navColorToBlack = false; }

  ngOnInit(): void {
  }

}
