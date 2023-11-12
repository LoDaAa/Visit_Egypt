import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon'
import { MatExpansionModule } from '@angular/material/expansion';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';  
import { TranslateHttpLoader } from '@ngx-translate/http-loader';  
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';  
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExperienceComponent } from './pages/experience/experience.component';
import { KeyInformationComponent } from './pages/key-information/key-information.component';
import { PlacesToGoComponent } from './pages/places-to-go/places-to-go.component';
import { HomeComponent } from './pages/home/home.component';
import { PlanYourTripComponent } from './pages/plan-your-trip/plan-your-trip.component';
import { CairoComponent } from './cities/cairo/cairo.component';
import { AlexandriaComponent } from './cities/alexandria/alexandria.component';
import { SharmElSheikhComponent } from './cities/sharm-el-sheikh/sharm-el-sheikh.component';
import { LuxorComponent } from './cities/luxor/luxor.component';
import { AswanComponent } from './cities/hurghada/hurghada.component';
import { AncientComponent } from './cities/ancient/ancient.component';
import { BeachesComponent } from './pages/places-to-go/beaches/beaches.component';
import { HeaderComponent } from './pages/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlaceDetailsComponent } from './pages/plan-your-trip/place-details/place-details.component';
import { AddToYourTripButtonComponent } from './pages/plan-your-trip/addToYourTrip/add-to-your-trip-button/add-to-your-trip-button.component';
import { PyramidsComponent } from './cities/cairo/places/pyramids/pyramids.component';
import { LoginComponent } from './pages/header/login/login.component';
import { WebReqInterceptorService } from './services/web-request.interceptor.service';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddToYourTripComponent } from './pages/add-to-your-trip/add-to-your-trip.component';
import { BeginPasswordResetComponent } from './pages/passwordReset/begin-password-reset/begin-password-reset.component';
import { SendPasswordResetComponent } from './pages/passwordReset/send-password-reset/send-password-reset.component';
import { ConfirmPasswordResetComponent } from './pages/passwordReset/confirm-password-reset/confirm-password-reset.component';
import { ResetPasswordComponent } from './pages/passwordReset/reset-password/reset-password.component';
import { PasswordResetCompleteComponent } from './pages/passwordReset/password-reset-complete/password-reset-complete.component';
import { FoodComponent } from './pages/home/food/food.component';
import { NotFoundComponent } from './pages/header/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    ExperienceComponent,
    KeyInformationComponent,
    PlacesToGoComponent,
    HomeComponent,
    PlanYourTripComponent,
    CairoComponent,
    AlexandriaComponent,
    SharmElSheikhComponent,
    LuxorComponent,
    AswanComponent,
    AncientComponent,
    BeachesComponent,
    HeaderComponent,
    PlaceDetailsComponent,
    AddToYourTripButtonComponent,
    PyramidsComponent,
    LoginComponent,
    ProfileComponent,
    AddToYourTripComponent,
    BeginPasswordResetComponent,
    SendPasswordResetComponent,
    ConfirmPasswordResetComponent,
    ResetPasswordComponent,
    PasswordResetCompleteComponent,
    FoodComponent,
    NotFoundComponent
    ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    MatSelectModule,
    HttpClientModule,  
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatExpansionModule,
    
    TranslateModule.forRoot({  
    loader: {  
      provide: TranslateLoader,  
      useFactory: httpTranslateLoader,  
      deps: [HttpClient]  
      }  
   }), 
    FontAwesomeModule  
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS, useClass : WebReqInterceptorService, multi : true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('930563157543593')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

 // AOT compilation support  
 export function httpTranslateLoader(http: HttpClient) {  
  return new TranslateHttpLoader(http);  
}