
import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})

/**
 * used to pass the token through the HTTP-Header that server is able to validate it
 */
export class TokenInterceptorService implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>>{
        req = req.clone({
            setHeaders:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        });
        //send the next request, once another is finished
        return next.handle(req);
    }
}
