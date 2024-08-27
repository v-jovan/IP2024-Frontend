import { CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStoreService } from '../store/TokenStore/token-store.service';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const tokenService = inject(TokenStoreService);
  const router = inject(Router);

  if (tokenService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
