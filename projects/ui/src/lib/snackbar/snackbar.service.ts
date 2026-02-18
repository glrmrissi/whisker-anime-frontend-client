import {
    Injectable,
    ApplicationRef,
    ComponentRef,
    createComponent,
    EnvironmentInjector,
    inject
} from '@angular/core';
import { SnackBar } from './snackbar';

type SnackType = 'success' | 'error' | 'warning';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {

    private appRef = inject(ApplicationRef)
    private injector = inject(EnvironmentInjector);
    private snackRef?: ComponentRef<SnackBar>


    open(message: string, actionText: string = 'OK', duration: number = 3000, classMod?: SnackType,) {

        if (typeof document === 'undefined') {
            return;
        }

        if (this.snackRef) {
            this.close();
        }

        this.snackRef = createComponent(SnackBar, {
            environmentInjector: this.injector
        });

        this.snackRef.instance.message = message;
        this.snackRef.instance.actionText = actionText;

        this.snackRef.instance.action.subscribe(() => {
            this.close();
        });

        this.appRef.attachView(this.snackRef.hostView);

        document.body.appendChild(
            this.snackRef.location.nativeElement
        );

        if (classMod) {
            this.snackRef.location.nativeElement.classList.add(classMod);
        }

        setTimeout(() => this.close(), duration);
    }

    close() {
        if (!this.snackRef) return;

        this.appRef.detachView(this.snackRef.hostView)
        this.snackRef.destroy();
        this.snackRef = undefined;
    }
}
