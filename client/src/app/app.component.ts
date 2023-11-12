import { Component, HostListener, OnInit} from '@angular/core';
import $ from "jquery";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Visit Egypt | Khaled Garaween';
  preloading : boolean = true;

  constructor(){}

  ngOnInit(): void {

      if(!localStorage.getItem("preloading"))
      {
        var counter = 0;
    
        setInterval(() => {
          if(counter == 9) { 
            counter = 0; 
          }
      
          this.changeImage(counter);
          counter++;
        }, 2500);
      
        this.loading();
      }
      else
      {
        this.preloading = false;
      }
    }

    changeImage(counter : any) {
      var images = [
        '<i class="fa fa-suitcase fa-2x"></i>',
        '<i class="fa fa-ticket fa-2x"></i>',
      ];
    
      $(".loader .image").html(""+ images[counter] +"");
    }
    
    loading(){
      var num = 0;
    
      for(var i=0; i<=100; i++) {
        setTimeout(() => {
          $('.loader span').html(num+'%');
    
          if(num == 100) {
            localStorage.setItem("preloading", "true");
            this.preloading = false;
          }
          num++;
        },i*30);
      };     
}

    
}
