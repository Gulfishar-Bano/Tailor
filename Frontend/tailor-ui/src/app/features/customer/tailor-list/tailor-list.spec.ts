import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorList } from './tailor-list';

describe('TailorList', () => {
  let component: TailorList;
  let fixture: ComponentFixture<TailorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailorList],
    }).compileComponents();

    fixture = TestBed.createComponent(TailorList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
