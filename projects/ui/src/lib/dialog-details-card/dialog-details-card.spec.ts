import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailsCard } from './dialog-details-card';

describe('DialogDetailsCard', () => {
  let component: DialogDetailsCard;
  let fixture: ComponentFixture<DialogDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetailsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
