import { TestBed } from '@angular/core/testing';

import { NgxPhoneInputService } from './ngx-simple-phone-input.service';

describe('NgxPhoneInputService', () => {
  let service: NgxPhoneInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxPhoneInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
