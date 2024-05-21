import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket: any;
  roomId:string = '';
  constructor() {
    this.socket = io('https://wordle-socket.vercel.app');
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });
   }
}
