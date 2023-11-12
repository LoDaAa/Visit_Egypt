import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from 'src/app/services/web-request.service';

@Component({
  selector: 'app-pyramids',
  templateUrl: './pyramids.component.html',
  styleUrls: ['./pyramids.component.scss']
})

export class PyramidsComponent implements OnInit {
  
  WeatherData:any;
  isReadMore = true
  toggleMapVar : boolean = false;
  title : string = ''
  description : string = ''
  imgCover : string = ''
  img : string = ''

  constructor(private route: Router, private webRequest : WebRequestService) { }

  ngOnInit(): void {

    if(this.route.url.substr(1,13) == 'addToYourTrip')
    {
      this.webRequest.getPlaceDetails(this.route.url.substr(15)).subscribe(
        res => {
                this.title = res[0].title;
                this.description = res[0].description;
                this.imgCover = 'http://localhost:3000/' + res[0].imgCoverURL
                this.img = "http://localhost:3000/" + res[0].imgURL
                console.log(this.imgCover)
                this.getWeatherData(res[0].location);
               }
      )
    }
    else
    {
      this.webRequest.getPlaceDetails(this.route.url.substr(14)).subscribe(
        res => {
                this.title = res[0].title;
                this.description = res[0].description;
                this.imgCover = 'http://localhost:3000/' + res[0].imgCoverURL
                this.img = "http://localhost:3000/" + res[0].imgURL
                console.log(this.imgCover)
                this.getWeatherData(res[0].location);
               }
      )
    }
    
             
    this.WeatherData = {
      main : {},
      isDay: true
    };

  }

  getUrl()
  {
    return `url(${this.imgCover})`;
  }

  getWeatherData(location : string){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q= ${location} &appid=ff1bc4683fc7325e9c57e586c20cc03e`)
    .then(response=>response.json())
    .then(data=>{this.setWeatherData(data);})
  }

  setWeatherData(data : any){
    this.WeatherData = data;
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date();
    this.WeatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());
    this.WeatherData.temp_celcius = (this.WeatherData.main.temp - 273.15).toFixed(0);
    this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(0);
    this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(0);
    this.WeatherData.temp_feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(0);
  }

  showText() {
     this.isReadMore = !this.isReadMore
  }

  toggleMap()
  {
    this.toggleMapVar = !this.toggleMapVar;
  }
}
