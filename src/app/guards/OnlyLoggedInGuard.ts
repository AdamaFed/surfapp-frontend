import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot} from '@angular/router';

import {inject, Injectable} from '@angular/core';
import {UserService} from "../service/user.service";

export const OnlyLoggedInGuard: CanActivateFn = (
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot) => {

    if (localStorage.getItem("authority") === "ADMIN") {
      console.log("success")
      return true;
    } else {
      window.alert('You have to be an admin to access this area!');
      return false;
    }

}

