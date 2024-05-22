import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ChallangeModalComponent } from '../../modal/challange-modal/challange-modal.component';
import { targetWords } from '../../word';
import { NgClass } from '@angular/common';
import { WordleService } from '../../services/wordle.service';
import { MatButtonModule } from '@angular/material/button';
import { JoinRoomModalComponent } from '../../modal/join-room-modal/join-room-modal.component';

@Component({
  selector: 'app-single-player',
  standalone: true,
  imports: [NgClass,MatButtonModule],
  templateUrl: './single-player.component.html',
  styleUrl: './single-player.component.css'
})
export class SinglePlayerComponent implements OnInit,AfterViewInit,OnDestroy{


  keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];



  renderer = inject(Renderer2);
  @ViewChildren('cellRef') cellRefs?: QueryList<ElementRef>;
  @ViewChildren('keys') keyRefs?: QueryList<ElementRef>;
  private dialog =  inject(MatDialog);
  route = inject(ActivatedRoute);
  wordService = inject(WordleService);



  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let word = params['word'];
      this.wordService.goal  = word? atob(word) : targetWords[Math.floor(Math.random() * targetWords.length)];
    })
    this.wordService.renderer = this.renderer;

}

ngOnDestroy(): void {
  this.wordService.restartGame();
}

ngAfterViewInit(): void {
  this.wordService.cellRefs = this.cellRefs;
  this.wordService.keyRefs = this.keyRefs;
}
  @HostListener('window:keydown', ['$event'])

  handleInput(event: KeyboardEvent) {
    const isInputField = event.target instanceof HTMLInputElement;

  if (isInputField) {
    return;
  }
  this.wordService.handleInput(event);
  }


  onKeyClick(key: string) {
    this.handleInput(new KeyboardEvent('keydown', { key: key }));
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ChallangeModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDialog2(){
    const dialogRef = this.dialog.open(JoinRoomModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  }




