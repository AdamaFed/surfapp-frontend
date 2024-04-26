import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from '@angular/router';



export const AlwaysAuthGuardNew: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
    console.log('Alwaysguard');
    return true;
};
