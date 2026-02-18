import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Home } from './home/home';
import { Profile } from './profile/profile';
import { AnimeDetails } from './anime-details/anime-details';

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
