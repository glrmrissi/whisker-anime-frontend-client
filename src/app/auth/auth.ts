import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthInputs } from "./components/inputs-auth/inputs.auth";
import { Router } from "@angular/router";
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "./auth.service";
import { SnackBarService } from "../../../projects/ui/src/public-api";

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

    snackBar = inject(SnackBarService);

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
    }

    toggleLogin() {
        this.login.set(!this.login());
        this.register.set(false);
        this.forgotPassword.set(false);
        this.forgotPasswordSend.set(false);
    }

    toggleForgotPassword() {
        this.forgotPassword.set(!this.forgotPassword());
        this.forgotPasswordSend.set(false);
        this.register.set(false);
        this.login.set(false);
    }

     toggleForgotPasswordSend() {
        this.forgotPasswordSend.set(!this.forgotPasswordSend());
        this.forgotPassword.set(false);
        this.register.set(false);
        this.login.set(false);
    }

    navigateHome() {
        this.router.navigate(['/home']);
    }

    async loginUser(username: string, password: string) {
        await this._authService.login(username, password)
            .then(() => {
                this.navigateHome();
                this.snackBar.open(
                    'Login successful',
                    3000,
                    'success'
                )
            })
            .catch(() => {
                this.snackBar.open("Ops! Maybe this not your password or email!", 3000, 'error');
            });

    }

    async registerUser(nickName: string, username: string, password: string) {
        await this._authService.register(nickName, username, password)
            .then(() => {
                this.navigateHome();
            })
            .catch(() => {
                this.snackBar.open("Maybe this email or username already in use", 3000, 'warning')
            });
    }

    async resetPasswordUser(username: string) {
        console.log('Reset password attempt for email:', username);
        await this._authService.resetPassword(username)
            .then(() => {
                this.toggleForgotPasswordSend()
            })
            .catch(() => {
                this.snackBar.open("An error occurred", 3000, 'error')

            });
    }

    async sendCode(username: string, newPassword: string, code: string) {
        await this._authService.sendCode(username, newPassword, code)
            .then(() => {
                this.toggleLogin()
            })
            .catch(() => {
                this.snackBar.open("An error occurred", 3000, 'error')
            });
    }
}