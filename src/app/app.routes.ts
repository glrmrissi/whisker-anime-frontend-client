import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Home } from './home/home';
import { Profile } from './profile/profile';
import { AnimeDetails } from './anime-details/anime-details';
import { About } from './about/about';

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
        path: 'about',
        component: About
    },
    {
        path: 'profile',
        component: Profile
    },
    {
        path: 'anime/:id',
        component: AnimeDetails,
    },
    {
        path: '**',
        redirectTo: 'auth',
    }
];
