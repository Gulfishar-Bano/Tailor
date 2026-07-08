import { ComponentFixture, TestBed } from '@angular/core/testing';

import { measurement-choice-modal } from './measurement-choice-modal';

describe('MeasurementChoiceModal', () => {
  let component: MeasurementChoiceModal;
  let fixture: ComponentFixture<MeasurementChoiceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasurementChoiceModal],
    }).compileComponents();

    fixture = TestBed.createComponent(MeasurementChoiceModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
