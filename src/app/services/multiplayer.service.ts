import { ElementRef, Injectable, QueryList, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultDialogComponent } from '../modal/result-dialog/result-dialog.component';
import { words, targetWords } from '../word';

@Injectable({
  providedIn: 'root'
})
export class MultiplayerService {

  maxGuesses: number = 6; // Default value, can be changed
  wordLength: number = 5; // Default value, can be changed
  rows = Array.from({ length: this.maxGuesses }, (_, i) => i + 1);
  columns = Array.from({ length: this.wordLength }, (_, i) => i + 1);
  current_row = 1;
  currentOpp_row = 1;
  goal = '';
  keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];
  userInput: string[] = ['', '', '', '', '', ''];
  oppInput: string[] = ['', '', '', '', '', ''];
  oppDummyInput: string[] = ['', '', '', '', '', ''];
  cellRefs?: QueryList<ElementRef>;
  keyRefs?: QueryList<ElementRef>;
  cellOppRefs?: QueryList<ElementRef>;
  renderer :any;
  private _snackBar =  inject(MatSnackBar);
  private dialog =  inject(MatDialog);
  route = inject(ActivatedRoute);
  router = inject(Router);
  gameOver = signal(false);
  win  = false;

  isValid(word:string){
    return words.includes(word) ? true : false;
  }

  validateWord(word: string,isOpponent:boolean=false) {
    if (this.isValid(word) && word.length === this.wordLength) {
      const currentRow = isOpponent ? this.currentOpp_row : this.current_row;
      const cellRefs = isOpponent ? this.cellOppRefs : this.cellRefs;
      const userInput = isOpponent ? this.oppInput : this.userInput;

      const colors: string[] = new Array(this.wordLength).fill('DARK');
      const wordArray = word.split('');
      const goalArray = this.goal.split('');

      // First pass: Mark correct letters
      for (let i = 0; i < this.wordLength; i++) {
        if (goalArray[i] === wordArray[i]) {
          colors[i] = "GREEN";
          goalArray[i] = '0';
        }
      }

      // Second pass: Mark misplaced letters
      for (let i = 0; i < this.wordLength; i++) {
        if (colors[i] !== "GREEN") {
          const index = goalArray.indexOf(wordArray[i]);
          if (index !== -1) {
            colors[i] = "YELLOW";
            goalArray[index] = '0';
          }
        }
      }


      let delay = 0;
      for (let i = 0; i < this.wordLength; i++) {
        const cellRef = cellRefs?.get(currentRow * this.wordLength - this.wordLength + i);
        setTimeout(() => {
          if (colors[i] === "GREEN") {
            this.renderer.addClass(cellRef?.nativeElement, 'flip');
            this.renderer.addClass(cellRef?.nativeElement, 'correct');
            const keyIndex = this.keyboardRows.flat().indexOf(wordArray[i].toUpperCase());
            if (keyIndex !== -1 && this.keyRefs && !isOpponent) {
              const keyRef = this.keyRefs.get(keyIndex);
              this.renderer.addClass(keyRef?.nativeElement, 'correct');
            }

          } else if (colors[i] === "YELLOW") {
            this.renderer.addClass(cellRef?.nativeElement, 'flip');
            this.renderer.addClass(cellRef?.nativeElement, 'misplaced');
            const keyIndex = this.keyboardRows.flat().indexOf(wordArray[i].toUpperCase());
            if (keyIndex !== -1 && this.keyRefs && !isOpponent) {
              const keyRef = this.keyRefs.get(keyIndex);
              this.renderer.addClass(keyRef?.nativeElement, 'misplaced');
            }
          } else {
            this.renderer.addClass(cellRef?.nativeElement, 'flip');
            this.renderer.addClass(cellRef?.nativeElement, 'incorrect');
            const keyIndex = this.keyboardRows.flat().indexOf(wordArray[i].toUpperCase());
            if (keyIndex !== -1 && this.keyRefs && !isOpponent) {
              const keyRef = this.keyRefs.get(keyIndex);
              this.renderer.addClass(keyRef?.nativeElement, 'incorrect');
            }
          }
        }, delay);
        delay += 250;

      }
      if(userInput[currentRow - 1]===this.goal){
        this.gameOver.set(true);
        isOpponent ? this.openGameResultModal(false, this.goal): this.openGameResultModal(true);
      }
      else if (userInput.length===currentRow){
        this.gameOver.set(true);
        isOpponent ? this.openGameResultModal(true): this.openGameResultModal(false, this.goal);
      }
      else{
        isOpponent? this.currentOpp_row++ : this.current_row++;
      }


    } else if(!isOpponent){
      this._snackBar.open('Not a valid word', 'ok', {
        duration: 3000
      });
    }
  }

  handleInput(event: KeyboardEvent) {

    const key = event.key.toLowerCase();

    if (key.match(/^[a-zA-Z]$/) && this.userInput[this.current_row - 1].length < this.wordLength) {
      this.userInput[this.current_row - 1] += key;
    }
    else if (
      key === 'backspace' &&
      this.userInput[this.current_row - 1].length > 0) {
      this.userInput[this.current_row - 1] = this.userInput[
        this.current_row - 1
      ].slice(0, -1);
    }
    else if (
      key === 'enter' &&
      this.userInput[this.current_row - 1].length == this.wordLength
    ) {
      this.validateWord(this.userInput[this.current_row - 1]);

    }
  }

  handleOppInput(Key: string) {

    const key = Key.toLowerCase();

    if (key.match(/^[a-zA-Z]$/) && this.oppInput[this.currentOpp_row - 1].length < this.wordLength) {
      this.oppInput[this.currentOpp_row - 1] += key;
      this.oppDummyInput[this.currentOpp_row - 1] += '*';
    }
    else if (
      key === 'backspace' &&
      this.oppInput[this.currentOpp_row - 1].length > 0) {
      this.oppInput[this.currentOpp_row - 1] = this.oppInput[
        this.currentOpp_row - 1
      ].slice(0, -1);
      this.oppDummyInput[this.currentOpp_row - 1] = this.oppDummyInput[
        this.currentOpp_row - 1
      ].slice(0, -1);
    }
    else if (
      key === 'enter' &&
      this.oppInput[this.currentOpp_row - 1].length == this.wordLength
    ) {
      this.validateWord(this.oppInput[this.currentOpp_row - 1],true);

    }
  }

  openGameResultModal(isWin: boolean, correctWord?: string) {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      data: { isWin, correctWord: correctWord || '' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.restartGame();
      }
    });
  }


  restartGame() {
    // Reset game state variables
    this.maxGuesses = 6;
    this.rows = Array.from({ length: this.maxGuesses }, (_, i) => i + 1);
    this.current_row = 1;
    this.currentOpp_row = 1;
    this.goal = targetWords[Math.floor(Math.random() * targetWords.length)];
    this.userInput = ['', '', '', '', '', ''];
    this.oppInput = ['', '', '', '', '', ''];
    this.clearHighlights();
  }

  clearHighlights() {
    // Clear classes from cell elements
    if (this.cellRefs) {
      this.cellRefs.forEach(cellRef => {
        this.renderer.removeClass(cellRef.nativeElement, 'flip');
        this.renderer.removeClass(cellRef.nativeElement, 'correct');
        this.renderer.removeClass(cellRef.nativeElement, 'incorrect');
        this.renderer.removeClass(cellRef.nativeElement, 'misplaced');
      });}
      if(this.cellOppRefs){
      this.cellOppRefs.forEach(cellRef => {
        this.renderer.removeClass(cellRef.nativeElement, 'flip');
        this.renderer.removeClass(cellRef.nativeElement, 'correct');
        this.renderer.removeClass(cellRef.nativeElement, 'incorrect');
        this.renderer.removeClass(cellRef.nativeElement, 'misplaced');
      });}


    // Clear classes from keyboard key elements
    if (this.keyRefs) {
      this.keyRefs.forEach(keyRef => {
        this.renderer.removeClass(keyRef.nativeElement, 'correct');
        this.renderer.removeClass(keyRef.nativeElement, 'incorrect');
        this.renderer.removeClass(keyRef.nativeElement, 'misplaced');
      });
    }
  }



}
