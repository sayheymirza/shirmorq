import { Routes } from '@angular/router';
import { Game } from './routes/game';
import { Home } from './routes/home';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'game',
        component: Game,
    }
];
