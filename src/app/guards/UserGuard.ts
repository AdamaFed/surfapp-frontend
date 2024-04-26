import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "../service/user.service";



export const UserGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  if (localStorage.getItem("roles")) {
    if (localStorage.getItem("roles") === "USER" || localStorage.getItem("roles") === "ADMIN") {
      return inject(UserService).fetchUser();
    } else {
      window.alert('No access, You cheated on the roles!');
      return false;
    }
  } else {
    window.alert('You must be logged in for this area!');
    return false
  }
};
