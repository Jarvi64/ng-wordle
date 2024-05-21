import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket: any;
  roomId:string = '';
  constructor() {
    this.socket = io('http://localhost:3000');
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });
   }
}
