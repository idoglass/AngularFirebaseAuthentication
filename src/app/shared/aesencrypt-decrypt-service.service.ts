import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AESEncryptDecryptService {

  secretKey = environment.secretKey;
  constructor() { }

  encrypt(value: string): string{
    const secret = CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
    return encodeURIComponent(secret);
  }

  decrypt(textToDecrypt: string): any{
    const text = decodeURIComponent(textToDecrypt)
    return CryptoJS.AES.decrypt(text, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}
