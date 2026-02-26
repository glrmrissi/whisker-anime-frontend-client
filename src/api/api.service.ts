import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { catchError, firstValueFrom, map, Observable } from "rxjs";
import environment from "../shared/environments/environment.local";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor(
        private http: HttpClient,
    ) { }

    getBaseUrl(): string {
        return environment.apiUrl;
    }

    getV1<T = any>(endpoint: string, params: any, extraHeaders?: {}): Promise<T> {
        const url = `${this.getBaseUrl()}/${endpoint}`;
        const headers: Record<string, string> = {
            ...extraHeaders
        };
        return firstValueFrom(
            this.http.get<T>(url, { params: params, headers, withCredentials: true }).pipe(
                map((res: T) => res)
            )
        );
    }

    postV1<T = any>(endpoint: string, body: any, extraHeaders?: {}): Promise<T> {
        const url = `${this.getBaseUrl()}/${endpoint}`;
        const headers: Record<string, string> = {
            ...extraHeaders
        };
        return firstValueFrom(this.http.post<T>(url, body, { headers, withCredentials: true }).pipe(map((res: T) => res)));
    }

    patchV1<T = any>(endpoint: string, body: any, extraHeaders?: {}): Promise<T> {
        const url = `${this.getBaseUrl()}/${endpoint}`;
        const headers: Record<string, string> = {
            ...extraHeaders
        };
        return firstValueFrom(this.http.patch<T>(url, body, { headers, withCredentials: true }).pipe(map((res: T) => res)));
    }

    putV1<T = any>(endpoint: string, body: any, extraHeaders?: {}): Promise<T> {
        const url = `${this.getBaseUrl()}/${endpoint}`;
        const headers: Record<string, string> = {
            ...extraHeaders
        };
        return firstValueFrom(this.http.put<T>(url, body, { headers, withCredentials: true }).pipe(map((res: T) => res)));
    }

    deleteV1<T = any>(endpoint: string, extraHeaders?: {}): Promise<T> {
        const url = `${this.getBaseUrl()}/${endpoint}`;
        const headers: Record<string, string> = {
            ...extraHeaders
        };
        return firstValueFrom(this.http.delete<T>(url, { headers, withCredentials: true }).pipe(map((res: T) => res)));
    }

    async verifyToken(x_access_token: string | null): Promise<boolean> {
        const res = this.postV1<boolean>('auth/check-token', { x_access_token: x_access_token }).then(() => true).catch(() => false);
        return res
    }
}