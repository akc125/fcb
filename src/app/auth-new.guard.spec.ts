import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authNewGuard } from './auth-new.guard';

describe('authNewGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authNewGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
