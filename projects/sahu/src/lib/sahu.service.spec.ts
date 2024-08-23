import { TestBed } from '@angular/core/testing';

import { SahuService } from './sahu.service';

describe('SahuService', () => {
  let service: SahuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SahuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
