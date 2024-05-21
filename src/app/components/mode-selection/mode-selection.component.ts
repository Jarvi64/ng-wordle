import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { JoinRoomModalComponent } from '../../modal/join-room-modal/join-room-modal.component';

@Component({
  selector: 'app-mode-selection',
  standalone: true,
  imports: [MatButtonModule,RouterLink],
  templateUrl: './mode-selection.component.html',
  styleUrl: './mode-selection.component.css'
})
export class ModeSelectionComponent {
  private dialog = inject(MatDialog);
  openDialog(){
    const dialogRef = this.dialog.open(JoinRoomModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
