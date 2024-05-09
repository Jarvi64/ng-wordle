import { Injectable } from '@angular/core';
import { targetWords, words } from '../word';


@Injectable({
  providedIn: 'root'
})
export class WordleService {

  isValid(word:string){
    return words.includes(word) ? true : false;
  }
}
