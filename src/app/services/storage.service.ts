import { inject, Injectable, resource, signal } from '@angular/core';
import { CustomerModel } from '../models/CustomerModel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { UserModel } from '../models/UserModel';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto'

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  saveToken(token:string) : void{
    localStorage.setItem("LoggedUserToken", token);
  }

  saveUserInfo(data:string) : void{
    localStorage.setItem("LoggedUserInfo", data);
  }

  removeUserInfo() : void{
    localStorage.removeItem("LoggedUserInfo");
    localStorage.removeItem("LoggedUserToken");
  }

  getLoggedUserFromUserInfo() : UserModel {
  if(localStorage!=undefined)
    {
    const userData = localStorage.getItem("LoggedUserInfo") ?? "";
    return userData?JSON.parse(userData) as UserModel : new UserModel();
    }
    return new UserModel();
  }

  getLoggedUserFromToken() : UserModel {
    const encryptedData = localStorage.getItem("LoggedUserToken") ?? "";
    const buff = Buffer.from(encryptedData, 'base64')

    const key = crypto
    .createHash('sha512')
    .update("M2W*&_shsupdoi83v^GyUIlIopLiIf!~^")
    .digest('hex')
    .substring(0, 32)

    const encryptionIV = crypto
    .createHash('sha512')
    .update("4bnfe4e407b8921c104518903515b218")
    .digest('hex')
    .substring(0, 16)

    const originalText = crypto.createDecipheriv("aes-256-cbc", key, encryptionIV)
    .update(buff.toString('utf8'), 'hex', 'utf8');

    const tokenArray = originalText?.split('#_');
    const tokenValidaty = tokenArray[11];
    return {
        TemplateId: tokenArray ? tokenArray[0] : "",
        BusinessName: tokenArray ? tokenArray[1] : "",
        FirstName: tokenArray ? tokenArray[2] : "",
        LastName: tokenArray ? tokenArray[3] : "",
        PhoneNumber: tokenArray ? tokenArray[4] : "",
        Address: tokenArray ? tokenArray[5] : "",
        SiteUrl: tokenArray ? tokenArray[6] : "",
        RoleId: tokenArray ? tokenArray[7] : "",
        RoleName: tokenArray ? tokenArray[8] : "",
        ProfileImage: tokenArray ? tokenArray[9] : "",
        ProfileImagePath: tokenArray ? tokenArray[10] : "",
        IsLogged: tokenArray && tokenArray.length > 0
    } as UserModel;
  }
}