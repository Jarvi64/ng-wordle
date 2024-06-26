import { ElementRef, Injectable, QueryList, inject } from '@angular/core';
import { targetWords, words } from '../word';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResultDialogComponent } from '../modal/result-dialog/result-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class WordleService {

  maxGuesses: number = 6; // Default value, can be changed
  wordLength: number = 5; // Default value, can be changed
  rows = Array.from({ length: this.maxGuesses }, (_, i) => i + 1);
  columns = Array.from({ length: this.wordLength }, (_, i) => i + 1);
  current_row = 1;
  goal = '';
  keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];
  userInput: string[] = ['', '', '', '', '', ''];
  cellRefs?: QueryList<ElementRef>;
  keyRefs?: QueryList<ElementRef>;
  renderer :any;
  private _snackBar =  inject(MatSnackBar);
  private dialog =  inject(MatDialog);

  isValid(word:string){
    return words.includes(word) ? true : false;
  }

  validateWord(word: string) {
    if (this.isValid(word) && word.length === this.wordLength) {
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
        const cellRef = this.cellRefs?.get(this.current_row * this.wordLength - this.wordLength + i);
        setTimeout(() => {
          if (colors[i] === "GREEN") {
            this.renderer.addClass(cellRef?.nativeElement, 'flip');
            this.renderer.addClass(cellRef?.nativeElement, 'correct');
            const keyIndex = this.keyboardRows.flat().indexOf(wordArray[i].toUpperCase());
            if (keyIndex !== -1 && this.keyRefs) {
              const keyRef = this.keyRefs.get(keyIndex);
              this.renderer.addClass(keyRef?.nativeElement, 'correct');
            }

          } else if (colors[i] === "YELLOW") {
            this.renderer.addClass(cellRef?.nativeElement, 'flip');
            this.renderer.addClass(cellRef?.nativeElement, 'misplaced');
            const keyIndex = this.keyboardRows.flat().indexOf(wordArray[i].toUpperCase());
            if (keyIndex !== -1 && this.keyRefs) {
              const keyRef = this.keyRefs.get(keyIndex);
              this.renderer.addClass(keyRef?.nativeElement, 'misplaced');
            }
          } else {
            this.renderer.addClass(cellRef?.nativeElement, 'flip');
            this.renderer.addClass(cellRef?.nativeElement, 'incorrect');
            const keyIndex = this.keyboardRows.flat().indexOf(wordArray[i].toUpperCase());
            if (keyIndex !== -1 && this.keyRefs) {
              const keyRef = this.keyRefs.get(keyIndex);
              this.renderer.addClass(keyRef?.nativeElement, 'incorrect');
            }
          }
        }, delay);
        delay += 250;

      }
      if(this.userInput[this.current_row - 1]===this.goal){
        //to handle multiple modal being open on entering enter key twice
        this.current_row++;
        this.openGameResultModal(true);
      }
      else if (this.userInput.length===this.current_row){
        this.openGameResultModal(false, this.goal);
      }
      else{
        this.current_row++;
      }

    } else {
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
    this.goal = targetWords[Math.floor(Math.random() * targetWords.length)];
    this.userInput = ['', '', '', '', '', ''];
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
