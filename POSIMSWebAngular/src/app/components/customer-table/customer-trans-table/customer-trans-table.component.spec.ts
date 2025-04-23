import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTransTableComponent } from './customer-trans-table.component';

describe('CustomerTransTableComponent', () => {
  let component: CustomerTransTableComponent;
  let fixture: ComponentFixture<CustomerTransTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTransTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTransTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
