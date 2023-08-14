import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationResponse } from '../../../gs-api/src/models/authentication-response';
import { LoaderService } from '../../composants/loader/service/loader.service';
import { tap } from 'rxjs/operators';
import { error } from 'ng-packagr/lib/util/log';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private loaderService: LoaderService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    let authenticationResponse: AuthenticationResponse = {};
    if (localStorage.getItem('accessToken')) {
      const accessTokenObject = JSON.parse(localStorage.getItem('accessToken') as string);
      console.log('Raw accessTokenObject:', accessTokenObject); // Debug log
      const accessToken = accessTokenObject.token;
      console.log('Extracted accessTokend:', accessToken); // Debug log
      const authReq = req.clone({
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + accessToken
        })
      });
      console.log('authReq:', authReq); // Debug log
      return this.handleRequest(authReq, next);
    }
    
     
    return this.handleRequest(req, next);
  }

  handleRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.loaderService.hide();
        }
      }, (err: any) => {
        this.loaderService.hide();
      }));
  }
}
