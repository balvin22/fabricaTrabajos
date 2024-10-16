import { Injectable } from '@angular/core';
import { TokenModel } from '@shared/models/token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  setToken(token:TokenModel){
    const {access_token: acces_token,token_type}= token;
    const new_token=`${token_type} ${acces_token}`;

    localStorage.setItem('token',new_token)
  }

  getToken(){
    return  localStorage.getItem('token');
  }

  constructor() { }
}
