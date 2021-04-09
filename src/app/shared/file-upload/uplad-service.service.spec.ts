import { TestBed } from '@angular/core/testing';

import { UpladServiceService } from './uplad-service.service';

describe('UpladServiceService', () => {
  let service: UpladServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpladServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
