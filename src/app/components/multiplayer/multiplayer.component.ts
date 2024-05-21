import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChildren, effect, inject, signal } from '@angular/core';
import { WordleService } from '../../services/wordle.service';
import { NgClass } from '@angular/common';
import { SocketService } from '../../services/socket.service';

import { targetWords } from '../../word';
import { MultiplayerService } from '../../services/multiplayer.service';

@Component({
  selector: 'app-multiplayer',
  standalone: true,
  imports: [NgClass],
  templateUrl: './multiplayer.component.html',
  styleUrl: './multiplayer.component.css'
})
export class MultiplayerComponent implements OnInit,AfterViewInit {

  wordService = inject(MultiplayerService);
  keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];
  countdown  = signal(120);
  countdownInterval: any;


  renderer = inject(Renderer2);
  @ViewChildren('cellRef') cellRefs?: QueryList<ElementRef>;
  @ViewChildren('cellReff') cellReff?: QueryList<ElementRef>;
  @ViewChildren('keys') keyRefs?: QueryList<ElementRef>;
  playerJoined = signal(false);
  socketService = inject(SocketService);

  @HostListener('window:keydown', ['$event'])

  handleInput(event: KeyboardEvent) {
    const isInputField = event.target instanceof HTMLInputElement;
    if(this.playerJoined() == false){
      return;
    }
    if (isInputField) {
      return;
    }
    let key = event.key;
    this.socketService.socket.emit('game_update',key,this.socketService.roomId);

    this.wordService.handleInput(event);
  }



  ngOnInit(): void {
    this.socketService.socket.on('player_joined',(word:string) => {
      this.wordService.goal = word;
      this.playerJoined.set(true);
      this.startCountdown();
    });
    this.wordService.renderer = this.renderer;
    this.socketService.socket.on('key_update',(event:any)=>{
      console.log(event);

      this.wordService.handleOppInput(event);
    })

    effect(()=>{
      this.wordService.gameOver();
      this.socketService.socket.emit('reset word',this.socketService.roomId,targetWords[Math.floor(Math.random() * targetWords.length)]);
    })

  }
  ngAfterViewInit(): void {
    this.wordService.cellRefs = this.cellRefs;
    this.wordService.cellOppRefs = this.cellReff;
    this.wordService.keyRefs = this.keyRefs;
  }

  onKeyClick(key: string) {
    this.handleInput(new KeyboardEvent('keydown', { key: key }));
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if(this.countdown())
      {
        this.countdown.update(val=>val-1);
        if (this.countdown() <= 0) {
          clearInterval(this.countdownInterval); // Stop the countdown when it reaches 0
        }

      }
    }, 1000);
  }

}
