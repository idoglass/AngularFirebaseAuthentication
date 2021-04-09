import { TestBed } from '@angular/core/testing';

import { NoGroupGuard } from './no-group.guard';

describe('NoGroupGuard', () => {
  let guard: NoGroupGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoGroupGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
