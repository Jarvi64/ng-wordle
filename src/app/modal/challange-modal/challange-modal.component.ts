import { Component, inject, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import {Clipboard} from '@angular/cdk/clipboard';
import { WordleService } from '../../services/wordle.service';

@Component({
  selector: 'app-challange-modal',
  standalone: true,
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,MatDialogModule
  ],  templateUrl: './challange-modal.component.html',
  styleUrl: './challange-modal.component.css'
})
export class ChallangeModalComponent {

  word = '';
  clipboard = inject(Clipboard);
  showInvalidWordError = signal(false);
  showLinkCopied = signal(false);
  _wordleService = inject(WordleService);

  copyLink(){
    if(this._wordleService.isValid(this.word)){
      const encodedWord = btoa(this.word);
      const link = `https://example.com?word=${encodedWord}`;
      this.clipboard.copy(link);
      this.showInvalidWordError.set(false);
      this.showLinkCopied.set(true);
    }
    else{
      this.showLinkCopied.set(false);
      this.showInvalidWordError.set(true);
    }
  }

}
