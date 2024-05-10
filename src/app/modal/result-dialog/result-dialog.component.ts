import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-result-dialog',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './result-dialog.component.html',
  styleUrl: './result-dialog.component.css'
})
export class ResultDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isWin: boolean; correctWord: string }
  ) {}

}
