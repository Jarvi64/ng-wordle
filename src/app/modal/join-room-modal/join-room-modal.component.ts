import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { targetWords } from '../../word';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-join-room-modal',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule,MatFormField,MatInputModule,FormsModule,MatRadioModule],
  templateUrl: './join-room-modal.component.html',
  styleUrl: './join-room-modal.component.css'
})
export class JoinRoomModalComponent implements OnInit{
  roomId: string = '';
  selectedOption = '';
  showInvalidRoomError = signal(false);
  word = '';
  socketService = inject(SocketService);

  constructor(public dialogRef: MatDialogRef<JoinRoomModalComponent>, private router: Router) {
    this.word = targetWords[Math.floor(Math.random() * targetWords.length)];
  }

  ngOnInit(): void {
  }

  continue(){
    if(this.selectedOption==='join'){
      this.socketService.socket.emit('Join room',this.roomId);
    }
    else if (this.selectedOption === 'create'){
      let roomId = crypto.randomUUID();
      this.socketService.roomId = roomId;
      this.socketService.socket.emit('create room',roomId,this.word);
      this.dialogRef.close();
      this.router.navigate(['/multi-player'],{ queryParams: {roomId:roomId}});
    }

    this.socketService.socket.on('room_error',() => {
      this.showInvalidRoomError.set(true);
    });

    this.socketService.socket.on('joined_room', () => {
      this.dialogRef.close();
      this.socketService.roomId = this.roomId;
      this.router.navigate(['/multi-player'],{ queryParams: {roomId:this.roomId}});
    });
  }

}
