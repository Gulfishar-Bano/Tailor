import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorProfile } from './tailor-profile';

describe('TailorProfile', () => {
  let component: TailorProfile;
  let fixture: ComponentFixture<TailorProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailorProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(TailorProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
