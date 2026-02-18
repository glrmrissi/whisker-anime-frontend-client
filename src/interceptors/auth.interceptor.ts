import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackBarService } from '../../projects/ui/src/public-api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const snackBar = inject(SnackBarService);

    return next(req).pipe(
        catchError(error => {
            if (error.status === 401 || error.status === 403) {
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};