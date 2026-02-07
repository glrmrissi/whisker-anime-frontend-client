import { Component, Input, Output, EventEmitter, signal, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faEye, faEyeSlash, faUser, faLock, faTag } from "@fortawesome/free-solid-svg-icons";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
    selector: 'app-auth-inputs',
    templateUrl: './inputs.auth.html',
    styleUrls: ['./inputs.auth.css'],
    imports: [FaIconComponent, ReactiveFormsModule],
    standalone: true
})

export class AuthInputs implements OnInit {
    @Input() type: string = 'text';
    @Input() placeholder: string = '';
    @Input() icon: string = '';
    @Output() valueChange = new EventEmitter<string>();
    @Output() inputEvent = new EventEmitter<Event>();

    emailControl: FormControl | null = null;
    passwordControl: FormControl | null = null;

    isEmailValid = signal(false);
    isPasswordValid = signal(false);
    errorMessage = signal('');

    iconMap = {
        'eye': faEye,
        'eyeSlash': faEyeSlash,
        'user': faUser,
        'lock': faLock,
        'tag': faTag
    };

    isPasswordVisible: boolean = false;

    constructor() {}

    ngOnInit() {
        if (this.type === 'email') {
            this.emailControl = new FormControl('');
            this.emailControl.valueChanges
                .pipe(
                    debounceTime(300),
                    distinctUntilChanged()
                )
                .subscribe((value) => {
                    const validation = this.validateEmail(value || '');
                    this.isEmailValid.set(validation.isValid);
                    this.errorMessage.set(validation.message);
                });
        }
        if (this.type === 'password') {
            this.passwordControl = new FormControl('');
            this.passwordControl.valueChanges
                .pipe(
                    debounceTime(300),
                    distinctUntilChanged()
                )
                .subscribe((value) => {
                    const validation = this.validatePasswordStrength(value || '');
                    this.isPasswordValid.set(validation.isValid);
                    this.errorMessage.set(validation.message);
                });
        }
    }

    validatePasswordStrength(password: string): { isValid: boolean; message: string } {
        if (!password) {
            return { isValid: false, message: 'Password é obrigatório' };
        }
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
        let message = 'Password must contain:';
        if (!hasUpperCase) message += ' an uppercase letter,';
        if (!hasLowerCase) message += ' a lowercase letter,';
        if (!hasNumber) message += ' a number,';
        if (!hasSpecialChar) message += ' a special character,';
        message = message.replace(/,$/, '.');
        return { isValid, message: isValid ? '' : message };
    }

    validateEmail(email: string): { isValid: boolean; message: string } {
        if (!email) {
            return { isValid: false, message: 'Email é obrigatório' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        return {
            isValid,
            message: isValid ? '' : 'Email inválido'
        };
    }

    get currentIcon() {
        return this.iconMap[this.icon as keyof typeof this.iconMap];
    }

    onInput(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (this.type === 'email' && this.emailControl) {
            this.emailControl.setValue(inputElement.value);
        }
        this.valueChange.emit(inputElement.value);
        this.inputEvent.emit(event);
    }

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.type = this.isPasswordVisible ? 'text' : 'password';
    }
}