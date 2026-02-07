import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { ApiService } from "../../api/api.service";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = false;
    private platformId = inject(PLATFORM_ID);


    constructor(
        private _apiService: ApiService
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.isAuthenticated = !!localStorage.getItem('x_access_token');
        }
    }

    async login(username: string, password: string): Promise<void> {
        try {
            const response = await this._apiService.postV1('user-auth/login', { username, password });
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem('x_access_token', response.access_token); 
                console.log('Stored access token in localStorage:', response);
                this.isAuthenticated = true;
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }
}