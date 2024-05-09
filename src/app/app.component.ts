import { Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { targetWords, words } from './word';
import { NgClass } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ChallangeModalComponent } from './modal/challange-modal/challange-modal.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass,MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{

  ngOnInit(): void {
  }

  title = 'ng-wordle';
  maxGuesses: number = 6; // Default value, can be changed
  wordLength: number = 5; // Default value, can be changed
  rows = Array.from({ length: this.maxGuesses }, (_, i) => i + 1);
  columns = Array.from({ length: this.wordLength }, (_, i) => i + 1);
  current_row = 1;
  goal = targetWords[Math.floor(Math.random() * targetWords.length)];
  // goal = 'maxim'
  keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];

  userInput: string[] = ['', '', '', '', '', ''];
  dictionary: string[] = words;

  renderer = inject(Renderer2);
  @ViewChildren('cellRef') cellRefs?: QueryList<ElementRef>;
  @ViewChildren('keys') keyRefs?: QueryList<ElementRef>;
  private _snackBar =  inject(MatSnackBar);
  private dialog =  inject(MatDialog);


  @HostListener('document:keydown', ['$event'])
  handleInput(event: KeyboardEvent) {


    const key = event.key.toLowerCase();
    console.log(event);

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

  validateWord(word: string) {
    if (this.dictionary.includes(word) && word.length === this.wordLength) {
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
            // this.renderer.addClass(this.keyboard?.nativeElement, 'correct');

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
      if(word===this.goal){
        this._snackBar.open('sucess is yours', 'ok');
      }
      else if (this.userInput.length===this.current_row){
        this._snackBar.open('you lose', 'ok');
      }
      else{
        this.current_row++;
      }
    } else {
      this._snackBar.open('Not a valid word', 'ok');
    }
  }

  onKeyClick(key: string) {
    this.handleInput(new KeyboardEvent('keydown', { key: key }));
  }

  addGuess(){
    this.maxGuesses++;
    this.rows.push(this.maxGuesses);
    this.userInput.push('');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChallangeModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}


