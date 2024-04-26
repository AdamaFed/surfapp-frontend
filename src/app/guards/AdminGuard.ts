import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot} from '@angular/router';

import {inject, Injectable} from '@angular/core';
import {UserService} from "../service/user.service";

export const AdminGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  if (localStorage.getItem("roles")) {
    if (localStorage.getItem("roles") === "ADMIN") {
      return inject(UserService).fetchUser();
    } else {
      window.alert('You have to be an admin to access this area!');
      return false;
    }
  } else {
    window.alert('You must be logged in for this area!');
    return false
  }


}

