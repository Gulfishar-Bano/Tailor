import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTailorList } from './admin-tailor-list';

describe('AdminTailorList', () => {
  let component: AdminTailorList;
  let fixture: ComponentFixture<AdminTailorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTailorList],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTailorList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
