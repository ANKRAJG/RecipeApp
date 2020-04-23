import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from '../user/user.model';
import { Router } from '@angular/router';

interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, 
                private router: Router) {}

    register(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD6ozq4s65fh8ME3y3fIV2Hm7DGu7ifhKQ',
                { email: email, password: password, returnSecureToken: true }
            )
            .pipe(
                catchError(this.handleError), 
                tap((resData: AuthResponseData) => {
                   this.handleAuthentication(
                       resData.email, 
                       resData.localId, 
                       resData.idToken, 
                       +resData.expiresIn
                    ); 
                })
            );
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD6ozq4s65fh8ME3y3fIV2Hm7DGu7ifhKQ', 
                { email: email, password: password, returnSecureToken: true }
            )
            .pipe(
                catchError(this.handleError),
                tap((resData: AuthResponseData) => {
                    this.handleAuthentication(
                        resData.email, 
                        resData.localId, 
                        resData.idToken, 
                        +resData.expiresIn
                     ); 
                 })
            );
    }

    autoLogin() {
        const userInfo: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userInfo'));
        if(!userInfo) {
            return;
        }
        const loadedUser = new User(
            userInfo.email, 
            userInfo.id, 
            userInfo._token, 
            new Date(userInfo._tokenExpirationDate)
        );
        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userInfo._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['./user/login']);
        localStorage.removeItem('userInfo');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(
            new Date().getTime() + (+expiresIn*1000)
        );
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userInfo', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMsg = 'An Error occurred';
        if(!errorRes.error || !errorRes.error.error) {
            return errorMsg;
        }
        switch(errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMsg = 'Email already exists';
                break;
            case 'INVALID_PASSWORD':
                errorMsg = 'Password is not correct';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMsg = 'Email does not exist';
                break;
        }
        return throwError(errorMsg);
    }
}