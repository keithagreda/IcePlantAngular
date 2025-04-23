import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransLedgerComponent } from './trans-ledger.component';

describe('TransLedgerComponent', () => {
  let component: TransLedgerComponent;
  let fixture: ComponentFixture<TransLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransLedgerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
