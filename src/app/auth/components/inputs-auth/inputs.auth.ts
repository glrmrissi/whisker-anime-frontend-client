import { Component, Input, Output, EventEmitter, signal, OnInit, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faEye, faEyeSlash, faUser, faLock, faTag } from "@fortawesome/free-solid-svg-icons";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
    selector: 'app-auth-inputs',
    templateUrl: './inputs.auth.html',
    styleUrls: ['./inputs.auth.css'],
    imports: [FaIconComponent, ReactiveFormsModule],
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AuthInputs),
            multi: true
        }
    ]
})

export class AuthInputs implements OnInit, ControlValueAccessor {
    @Input() type: string = 'text';
    @Input() placeholder: string = '';
    @Input() icon: string = '';
    @Output() valueChange = new EventEmitter<string>();
    @Output() inputEvent = new EventEmitter<Event>();

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
    internalControl = new FormControl<string>('');

    private onChangeFn: (value: string) => void = () => {};
    private onTouchedFn: () => void = () => {};

    constructor() {}

    writeValue(value: string | null): void {
        this.internalControl.setValue(value ?? '', { emitEvent: false });
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChangeFn = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouchedFn = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.internalControl.disable({ emitEvent: false });
        } else {
            this.internalControl.enable({ emitEvent: false });
        }
    }

    ngOnInit() {
        this.internalControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((value) => {
                const nextValue = value ?? '';
                this.onChangeFn(nextValue);

                if (this.type === 'email') {
                    const validation = this.validateEmail(nextValue);
                    this.isEmailValid.set(validation.isValid);
                    this.errorMessage.set(validation.message);
                }
                if (this.type === 'password') {
                    const validation = this.validatePasswordStrength(nextValue);
                    this.isPasswordValid.set(validation.isValid);
                    this.errorMessage.set(validation.message);
                }
            });
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
        this.valueChange.emit(inputElement.value);
        this.inputEvent.emit(event);
    }

    onBlur() {
        this.onTouchedFn();
    }

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.type = this.isPasswordVisible ? 'text' : 'password';
    }
}