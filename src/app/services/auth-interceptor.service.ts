import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if(!userInfo) {
            return next.handle(req);
        }
        const modifiedReq = req.clone({
            params: new HttpParams().set('auth', userInfo._token)
        });
        return next.handle(modifiedReq);
    }
}