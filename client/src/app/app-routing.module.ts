import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { KeyInformationComponent } from './pages/key-information/key-information.component';
import { ExperienceComponent } from './pages/experience/experience.component';
import { PlacesToGoComponent } from './pages/places-to-go/places-to-go.component';
import { PlanYourTripComponent } from './pages/plan-your-trip/plan-your-trip.component';
import { CairoComponent } from './cities/cairo/cairo.component';
import { AlexandriaComponent } from './cities/alexandria/alexandria.component';
import { AswanComponent } from './cities/hurghada/hurghada.component';
import { LuxorComponent } from './cities/luxor/luxor.component';
import { SharmElSheikhComponent } from './cities/sharm-el-sheikh/sharm-el-sheikh.component';
import { AncientComponent } from './cities/ancient/ancient.component';
import { BeachesComponent } from './pages/places-to-go/beaches/beaches.component';
import { PyramidsComponent } from './cities/cairo/places/pyramids/pyramids.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthService } from './services/auth.service';
import { AddToYourTripComponent } from './pages/add-to-your-trip/add-to-your-trip.component';
import { BeginPasswordResetComponent } from './pages/passwordReset/begin-password-reset/begin-password-reset.component';
import { SendPasswordResetComponent } from './pages/passwordReset/send-password-reset/send-password-reset.component';
import { ConfirmPasswordResetComponent } from './pages/passwordReset/confirm-password-reset/confirm-password-reset.component';
import { ResetPasswordComponent } from './pages/passwordReset/reset-password/reset-password.component';
import { PasswordResetCompleteComponent } from './pages/passwordReset/password-reset-complete/password-reset-complete.component';
import { FoodComponent } from './pages/home/food/food.component';
import { Auth2Service } from './services/auth2.service';
import { NotFoundComponent } from './pages/header/not-found/not-found.component';

const routes: Routes = [
    {
      path : "", redirectTo : "aboutEgypt", pathMatch : "full"
    },
    {
      path : "aboutEgypt", component : HomeComponent
    },
    {
    path : "placesToGo", component : PlacesToGoComponent
    },
    {
      path : "placesToGo/cairo", component : CairoComponent
    },
    { 
      path : "placesToGo/alexandria", component : AlexandriaComponent
    },
    { 
      path : "placesToGo/sharmEl-Sheikh", component : SharmElSheikhComponent
    },
    { 
      path : "placesToGo/luxor", component : LuxorComponent
    },
    { 
      path : "placesToGo/hurghada", component : AswanComponent
    },
    {
      path : "planYourTrip", component : PlanYourTripComponent
    },
    {
      path : "keyInformation", component : KeyInformationComponent
    },
    {
      path : "experience", component : ExperienceComponent
    },
    {
      path : "placesToGo/ancientEgyptianCities", component : AncientComponent
    },
    {
      path : "placesToGo/egyptianBeaches", component : BeachesComponent
    },
    {
      path : "planYourTrip/pyramids", component : PyramidsComponent
    },
    {
      path : "planYourTrip/egyptianMuseum", component : PyramidsComponent
    },
    {
      path : "planYourTrip/al-azhar", component : PyramidsComponent
    },
    {
      path : "planYourTrip/saqqara", component : PyramidsComponent
    },
    {
      path : "planYourTrip/khan-El-Khalili", component : PyramidsComponent
    },
    {
      path : "planYourTrip/citadel", component : PyramidsComponent
    },
    {
      path : "planYourTrip/tanis", component : PyramidsComponent
    },
    {
      path : "planYourTrip/bibliothecaAlexandria", component : PyramidsComponent
    },
    {
      path : "planYourTrip/straitsOfGubal", component : PyramidsComponent
    },
    {
      path : "planYourTrip/giftunIsland", component : PyramidsComponent
    },
    {
      path : "planYourTrip/fortQaitbey", component : PyramidsComponent
    },
    {
      path : "planYourTrip/thistlegormWreck", component : PyramidsComponent
    },
    {
      path : "planYourTrip/sindbadSubmarine", component : PyramidsComponent
    },
    {
      path : "planYourTrip/coloredCanyon", component : PyramidsComponent
    },
    {
      path : "planYourTrip/medinetHabu", component : PyramidsComponent
    },
    {
      path : "planYourTrip/templeOfKarnak", component : PyramidsComponent
    },
    {
      path : "planYourTrip/thebesCity", component : PyramidsComponent
    },
    {
      path : "planYourTrip/el-Gouna", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/pyramids", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/egyptian museum", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/al-azhar", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/saqqara", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/khan el-khalili", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/citadel", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/bibliotheca alexandria", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/giftun islands", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/straits of gubal", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/fort qaitbey", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/thistlegorm wreck", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/medinet habu", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/temple of karnak", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/thebes city", component : PyramidsComponent
    },
    {
      path : "addToYourTrip/el gouna", component : PyramidsComponent
    },
    {
      path : "profile", component : ProfileComponent, canActivate : [AuthService]
    },
    {
      path : "addToYourTrip", component : AddToYourTripComponent, canActivate : [AuthService]
    },
    {
      path : "begin_password_reset", component : BeginPasswordResetComponent
    },
    {
      path : "send_password_reset", component : SendPasswordResetComponent
    },
    {
      path : "confirm_pin_reset", component : ConfirmPasswordResetComponent
    },
    {
      path : "reset_password", component : ResetPasswordComponent
    },
    {
      path : "password_reset_complete", component : PasswordResetCompleteComponent
    },
    {
      path : "aboutEgyptLogin", component : HomeComponent, canActivate : [Auth2Service]
    },
    {
      path : "aboutEgypt/food", component : FoodComponent
    },
    {
      path : "aboutEgypt/food", component : FoodComponent
    },
    {
      path : "404", component : NotFoundComponent
    },
    {
      path : "**", redirectTo: '404'
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}
     )],
  exports: [RouterModule]
})

export class AppRoutingModule { }