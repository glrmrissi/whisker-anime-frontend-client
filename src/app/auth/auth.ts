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
    isForgotPassword = this.forgotPassword.asReadonly();

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
            password: new FormControl('')
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
        console.log('Register state:', this.register());
    }

    toggleLogin() {
        this.login.set(!this.login());
        this.register.set(false);
        this.forgotPassword.set(false);
        console.log('Login state:', this.login());
    }

    toggleForgotPassword() {
        this.forgotPassword.set(!this.forgotPassword());
        this.register.set(false);
        this.login.set(false);
        console.log('Forgot Password state:', this.forgotPassword());
    }

    navigateHome() {
        console.log('Navigating to home...');
        this.router.navigate(['/home']);
    }

    loginUser(username: string, password: string) {
        console.log('Login attempt with username:', username, 'and password:', password
        );
        this._authService.login(username, password)
            .then(() => {
                console.log('Login successful, navigating to home...');
                this.navigateHome();
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
            
    }

    registerUser(username: string, email: string, password: string) {
        console.log('Register attempt with username:', username, 'email:', email, 'and password:', password);
    }

    resetPasswordUser(email: string) {
        console.log('Reset password attempt for email:', email);
    }
}