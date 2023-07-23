import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const isLoggedIn = token != undefined && token.length > 1;
  return isLoggedIn;
};
