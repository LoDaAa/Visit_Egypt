import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse} from '@angular/common/http'
import { tap } from 'rxjs/operators'
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  constructor(private _http : HttpClient) { }

  private _userUrl = "http://localhost:3000/api/user"
  private _registerUrl = "http://localhost:3000/api/register"
  private _loginUrl = "http://localhost:3000/api/login"
  private _facebookloginUrl = "http://localhost:3000/auth/facebook"
  private _updateUserUrl = "http://localhost:3000/api/updateUser"
  private _updateImgUrl = "http://localhost:3000/api/uploadImgUser"
  private _resetUrl = "http://localhost:3000/api/begin_password_reset"
  private _getEmailUrl = "http://localhost:3000/api/getEmailUrl"
  private _sendEmailUrl = "http://localhost:3000/api/sendmail"
  private _sendUserEmailUrl = "http://localhost:3000/api/sendUserMail"
  private _codeUrl = "http://localhost:3000/api/confirm_pin_reset"
  private _passwordUrl = "http://localhost:3000/api/change_password"
  private _emailUrl = "http://localhost:3000/api/change_email"
  private _resetPas = "http://localhost:3000/api/reset_password"
  private _getNewAccessToken = "http://localhost:3000/api/users/me/access-token"
  private _verifyPassUrl = "http://localhost:3000/api/oldPassword"
  private _changePassUrl = "http://localhost:3000/api/changePassword"
  private _addPlaceUrl = "http://localhost:3000/api/places"
  private _addPlaceForTestingUrl = "http://localhost:3000/api/placesForTesting"
  private _checkAddPlaceStatusUrl = "http://localhost:3000/api/checkAddPlaceStatus"
  private _getPlaceDetailsUrl = "http://localhost:3000/api/getPlaceDetails"
  private _getChosenPlacesUrl = "http://localhost:3000/api/getChosenPlacesUrl"
  private _getCommentsUrl = "http://localhost:3000/api/getCommentsUrl"
  private getCityPlacesForExperienceUrl = "http://localhost:3000/api/getCityPlacesForExperienceUrl"
  private _getCityCommentsUrl = "http://localhost:3000/api/getCityCommentsUrl"
  private _addCommentUrl = "http://localhost:3000/api/addCommentUrl"
  private _likeUnlikeCommentUrl = "http://localhost:3000/api/likeUnlikeCommentUrl"
  private _signInWithGoogleUrl = "http://localhost:3000/api/signInWithGoogleUrl"
  private _signInWithFacebookUrl = "http://localhost:3000/api/signInWithFacebookUrl"

  getUserData(){
    return this._http.get(this._userUrl)
  }

  registerUser(user : any){
    return this._http.post<any>(this._registerUrl, user, {observe : "response"})
  }

  loginUser(user: any){
    return this._http.post(this._loginUrl, user, {observe : "response"})
  }

  facebookLogin(){
    return this._http.get(this._facebookloginUrl)
  }

  uploadImg(fd : any)
  {
    console.log(fd)
    return this._http.patch(this._updateImgUrl, fd)
  }

  updateUserData(userData : any)
  {
    return this._http.patch(this._updateUserUrl, userData)
  }

  verifyUserPass(email : any, pass : any)
  {
    return this._http.post(this._verifyPassUrl, {email, pass})
  }

  changeUserPass(password : any)
  {
    return this._http.patch(this._changePassUrl, {password})
  }

  addPlace(title : String, city : String){
    return this._http.post<any>(this._addPlaceUrl, {title,  city})
  }

  addPlaceForTesting(title : String, city : String){
    let user_id = "617710b8b21eb32cdc1daeae"
    return this._http.post<any>(this._addPlaceForTestingUrl, {title,  city, user_id})
  }

  checkAddPlaceStatus(title : String)
  {
    return this._http.post<any>(this._checkAddPlaceStatusUrl, {title})
  }

  getChosenPlaces()
  {
    return this._http.get<any>(this._getChosenPlacesUrl)
  }

  getPlaceDetails(place : string)
  {
    return this._http.post<any>(this._getPlaceDetailsUrl, {place})
  }

  searchUser(user: any){
    return this._http.post<any>(this._resetUrl, user)
  }

  getEmail(){
    return this._http.get<any>(this._getEmailUrl)
  }

  sendEmail(email: any){
    return this._http.post<any>(this._sendEmailUrl, {email})
  }

  sendUserEmail(userEmail: any, message : any){
    return this._http.post<any>(this._sendUserEmailUrl, {userEmail ,message})
  }

  sendCode(code: string){
    return this._http.post<any>(this._codeUrl, {code})
  }

  sendPasswords(user: any){
    return this._http.post<any>(this._passwordUrl, user)
  }

  changeEmail(user: any){
    return this._http.post<any>(this._emailUrl, user)
  }

  resetPassword(user: any){
    return this._http.post<any>(this._resetPas, user)
  }

  getComments()
  {
    return this._http.get<any>(this._getCommentsUrl)
  }

  getCityPlacesForExperience(city : string)
  {
    return this._http.post<any>(this.getCityPlacesForExperienceUrl, {city})
  }

  getCityComments(city : string)
  {
    return this._http.post<any>(this._getCityCommentsUrl, {city})
  }

  addComment(city : string, place : string, comment : string)
  {
    return this._http.post<any>(this._addCommentUrl, {city, place, comment})
  }

  likeUnlikeComment(comment : any, likeUnLike : string)
  {
    return this._http.patch<any>(this._likeUnlikeCommentUrl, {comment, likeUnLike})
  }

  SignInWithGoogleUrl(email : string, username : string, imageURL : string)
  {
    return this._http.post<any>(this._signInWithGoogleUrl, {email, username, imageURL})
  }

  SignInWithFacebookUrl(email : string, username : string, imageURL : string)
  {
    return this._http.post<any>(this._signInWithFacebookUrl, {email, username, imageURL})
  }

  SearchUser(user : any){
    return this._http.post<any>(this._resetUrl, user)
  }

  loggedIn(){
      return !!localStorage.getItem('token')
  }

  getToken(){
    return localStorage.getItem('token')
  }

  loggOut(){
    localStorage.removeItem('token')
  }

  getRefreshToken(){
    return localStorage.getItem('x-refresh-token')
  }

  getUserId(){
    return localStorage.getItem('userId')
  }

  setAccessToken(accessToken : string){
    return localStorage.setItem('x-access-token', accessToken)
  }

  getNewAccessToken(){
    return this._http.get(this._getNewAccessToken, {
      headers : {
        'x-refresh-token' : this.getRefreshToken() as string,
        '_id' : this.getUserId() as string
      }, 
       observe : "response" 
    }).pipe(
      tap((res : HttpResponse<any>) =>{
          this.setAccessToken(res.headers.get('x-access-token') as any)
      })
    )
  }
}
