import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: GameComponent },
    { path: '**', component: NotFoundComponent }
];
