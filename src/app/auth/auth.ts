import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthInputs } from "./components/inputs-auth/inputs.auth";
import { Router } from "@angular/router";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.html',
    styleUrls: ['./auth.css'],
    imports: [CommonModule, AuthInputs],
    standalone: true
})

export class Auth implements OnInit {
    register = signal(false);
    isRegister = this.register.asReadonly();
    login = signal(true);
    isLogin = this.login.asReadonly();
    forgotPassword = signal(false);
    isForgotPassword = this.forgotPassword.asReadonly();

    router: Router;

    constructor(router: Router) {
        this.router = router;
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
}