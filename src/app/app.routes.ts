import { Routes } from '@angular/router';
import { SinglePlayerComponent } from './components/single-player/single-player.component';
import { MultiplayerComponent } from './components/multiplayer/multiplayer.component';
import { ModeSelectionComponent } from './components/mode-selection/mode-selection.component';

export const routes: Routes = [
  { path: '', component: ModeSelectionComponent },
  { path: 'single-player', component: SinglePlayerComponent },
  { path: 'multi-player', component: MultiplayerComponent },
];
