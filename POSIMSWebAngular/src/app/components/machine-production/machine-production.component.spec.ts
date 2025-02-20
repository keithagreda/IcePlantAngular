import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineProductionComponent } from './machine-production.component';

describe('MachineProductionComponent', () => {
  let component: MachineProductionComponent;
  let fixture: ComponentFixture<MachineProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineProductionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachineProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
