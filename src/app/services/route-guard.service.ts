import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import jwt_decode from 'jwt-decode'; 
import { isFormattedError } from '@angular/compiler';
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public auth: AuthService,
    public router: Router,
    private snackbarService: SnackbarService) { }

    canActivate(route: ActivatedRouteSnapshot): boolean{
      let expectedRoleArray = route.data;
      expectedRoleArray = expectedRoleArray.expectedRole;

      const token: any = localStorage.getItem('token');

      var tokenPaylaod: any;

      try{
        tokenPaylaod = jwt_decode(token)
      }
      catch(err){
        localStorage.clear();
        this.router.navigate(['/']);
      }

      let expectedRole = '';

      for(let i =0; i<expectedRoleArray.length ; i++ ){
         if(expectedRoleArray[i] == tokenPaylaod.role){
            expectedRole =tokenPaylaod.role;
         }
      }

      if(tokenPaylaod.role == 'user' || tokenPaylaod.role == 'admin'){
        if(this.auth.isAuthenticated() && tokenPaylaod.role == expectedRole){
          return true;
        }
        this.snackbarService.openSncakBar(GlobalConstants.unauthorize, GlobalConstants.error);
        this.router.navigate(['/cafe/dashboard'])
        return false;
      }
      else{
        this.router.navigate(['/']);
        localStorage.clear();
        return false;
      }
    }
}
