import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { ApiService } from "../../api/api.service";
import { isPlatformBrowser } from "@angular/common";
import { SnackBarService } from "../../../projects/ui/src/public-api";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = false;
    private platformId = inject(PLATFORM_ID);

    snackBar = inject(SnackBarService);

    constructor(
        private _apiService: ApiService
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.isAuthenticated = !!localStorage.getItem('x_access_token');
        }
    }

    async login(username: string, password: string): Promise<void> {
        try {
            await this._apiService.postV1('user-auth/login', { username, password });
            if (isPlatformBrowser(this.platformId)) {
                this.isAuthenticated = true;
                this.snackBar.open(
                    'Login successful',
                    'OK',
                    3000,
                    'success'
                )
            }
        } catch (error) {
            this.snackBar.open(
                'Incorrect email or password',
                'OK',
                3000,
                'error'
            )
            throw error;
        }
    }

    async register(nickName: string, username: string, password: string): Promise<void> {
        try {
            await this._apiService.postV1('user-auth/register', { nickName, username, password });
            if (isPlatformBrowser(this.platformId)) {
                this.isAuthenticated = true;
            }
        } catch (error) {
            console.error('Register failed:', error);
            throw error;
        }
    }

    async resetPassword(username: string): Promise<void> {
        try {
            await this._apiService.postV1('user-auth/forgot-password', {
                username
            });
            if (isPlatformBrowser(this.platformId)) {
                this.isAuthenticated = true;
                this.snackBar.open(
                    'If that email exists, a code was sent.',
                    'OK',
                    10000,
                    'warning'
                )
            }
        } catch (error) {
            console.error('Reset password failed:', error);
            throw error;
        }
    }

    async sendCode(username: string, newPassword: string, code: string): Promise<void> {
        try {
            await this._apiService.patchV1('user-auth/new-password', { username, newPassword, code });
            if (isPlatformBrowser(this.platformId)) {
                this.isAuthenticated = true;
                this.snackBar.open(
                    'Your password has been reset!',
                    'OK',
                    3000,
                    'success'
                )
            }
        } catch (error) {
            this.snackBar.open(
                'Error when reset password!',
                'OK',
                3000,
                'error'
            )
            throw error;
        }
    }
}