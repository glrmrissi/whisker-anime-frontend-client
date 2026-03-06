import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadComponent: () => import('./auth/auth').then(m => m.Auth)
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home)
    },
    {
        path: 'about',
        loadComponent: () => import('./about/about').then(m => m.About)
    },
    {
        path: 'profile',
        loadComponent: () => import('./profile/profile').then(m => m.Profile)
    },
    {
        path: 'anime/:id',
        loadComponent: () => import('./anime-details/anime-details').then(m => m.AnimeDetails)
    },
    {
        path: 'favorites',
        loadComponent: () => import('./favorites/favorites').then(m => m.Favorites)
    },
    {
        path: '**',
        redirectTo: 'auth'
    }
];