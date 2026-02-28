import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthInputs } from "./components/inputs-auth/inputs.auth";
import { Router } from "@angular/router";
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.html',
    styleUrls: ['./auth.css'],
    imports: [CommonModule, AuthInputs, ReactiveFormsModule],
    standalone: true
})

export class Auth implements OnInit {
    register = signal(false);
    isRegister = this.register.asReadonly();
    username = signal('');
    email = signal('');
    password = signal('');
    login = signal(true);
    isLogin = this.login.asReadonly();
    forgotPassword = signal(false);
    forgotPasswordSend = signal(false);
    isForgotPassword = this.forgotPassword.asReadonly();
    isForgotPasswordSend = this.forgotPasswordSend.asReadonly();

    router: Router;
    authForm: FormGroup;

    constructor(
        router: Router,
        private _authService: AuthService

    ) {
        this.router = router;
        this.authForm = new FormGroup({
            username: new FormControl(''),
            email: new FormControl(''),
            password: new FormControl(''),
            code: new FormControl('')
        });
    }

    ngOnInit(): void {
        this.register.set(false);
        this.login.set(true);
        this.forgotPassword.set(false);
    }

    toggleRegister() {
        this.register.set(!this.register());
        this.login.set(false);
        this.forgotPassword.set(false);
        this.forgotPasswordSend.set(false);
        console.log('Register state:', this.register());
    }

    toggleLogin() {
        this.login.set(!this.login());
        this.register.set(false);
        this.forgotPassword.set(false);
        this.forgotPasswordSend.set(false);
        console.log('Login state:', this.login());
    }

    toggleForgotPassword() {
        this.forgotPassword.set(!this.forgotPassword());
        this.forgotPasswordSend.set(false);
        this.register.set(false);
        this.login.set(false);
        console.log('Forgot Password state:', this.forgotPassword());
    }

     toggleForgotPasswordSend() {
        this.forgotPasswordSend.set(!this.forgotPasswordSend());
        this.forgotPassword.set(false);
        this.register.set(false);
        this.login.set(false);
        console.log('Forgot Password Send state:', this.isForgotPasswordSend());
    }

    navigateHome() {
        console.log('Navigating to home...');
        this.router.navigate(['/home']);
    }

    async loginUser(username: string, password: string) {
        console.log('Login attempt with username:', username, 'and password:', password
        );
        await this._authService.login(username, password)
            .then(() => {
                console.log('Login successful, navigating to home...');
                this.navigateHome();
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });

    }

    async registerUser(nickName: string, username: string, password: string) {
        await this._authService.register(nickName, username, password)
            .then(() => {
                console.log('Login successful, navigating to home...');
                this.navigateHome();
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
    }

    async resetPasswordUser(username: string) {
        console.log('Reset password attempt for email:', username);
        await this._authService.resetPassword(username)
            .then(() => {
                this.toggleForgotPasswordSend()
            })
            .catch((error) => {
                console.error('Reset password failed:', error);
            });
    }

    async sendCode(username: string, newPassword: string, code: string) {
        await this._authService.sendCode(username, newPassword, code)
            .then(() => {
                this.toggleLogin()
            })
            .catch((error) => {
                console.error('Failed to save failed:', error);
            });
    }
}