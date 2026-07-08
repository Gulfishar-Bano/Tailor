import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorPortfolio } from './tailor-portfolio';

describe('TailorPortfolio', () => {
  let component: TailorPortfolio;
  let fixture: ComponentFixture<TailorPortfolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailorPortfolio],
    }).compileComponents();

    fixture = TestBed.createComponent(TailorPortfolio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
