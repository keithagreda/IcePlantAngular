import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintableSalesReportComponent } from './printable-sales-report.component';

describe('PrintableSalesReportComponent', () => {
  let component: PrintableSalesReportComponent;
  let fixture: ComponentFixture<PrintableSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintableSalesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintableSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
