import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: Auth
    },
    {
        path: 'home',
        component: Home
    },
    {
        path: '**',
        redirectTo: 'auth',
    }
];
