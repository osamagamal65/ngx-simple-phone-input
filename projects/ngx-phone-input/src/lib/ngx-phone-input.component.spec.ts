import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPhoneInputComponent } from './ngx-phone-input.component';

describe('NgxPhoneInputComponent', () => {
  let component: NgxPhoneInputComponent;
  let fixture: ComponentFixture<NgxPhoneInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxPhoneInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxPhoneInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
