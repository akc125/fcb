import { TestBed } from '@angular/core/testing';

import { CategoryFireService } from './category-fire.service';

describe('CategoryFireService', () => {
  let service: CategoryFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
