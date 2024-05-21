  import { Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, inject } from '@angular/core';
  import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
  import { NgClass } from '@angular/common';
  import {MatSnackBar} from '@angular/material/snack-bar';
  import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


  @Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterLink,RouterOutlet, NgClass,MatDialogModule,MatButtonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
  })
  export class AppComponent implements OnInit{
    constructor(){}

    ngOnInit(): void {
    }

  }
