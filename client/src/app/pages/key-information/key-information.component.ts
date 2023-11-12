import { Component, OnInit } from '@angular/core';
import { NavColorService } from 'src/app/nav-color.service';
import * as AOS from 'aos';

@Component({
  selector: 'app-key-information',
  templateUrl: './key-information.component.html',
  styleUrls: ['./key-information.component.scss']
})
export class KeyInformationComponent implements OnInit {

  constructor(public navColor : NavColorService) {this.navColor.navColorToBlack = false; }

  ngOnInit(): void {
  }

}
