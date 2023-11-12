import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss']
})
export class PlaceDetailsComponent implements OnInit {
  @Input() place!: any ;
  @Input() city!: any ;
  @Input() frame! : MDBModalRef;
  @Input() addInitialState!: any ;
  @Input() addStatusText!: any ;
  @Input() addState!: any ;

  constructor() { }

  ngOnInit(): void {
  }

  hide()
  {
    this.frame.hide();
  }
}

