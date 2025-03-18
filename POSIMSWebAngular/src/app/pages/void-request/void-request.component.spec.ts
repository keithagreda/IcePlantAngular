import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidRequestComponent } from './void-request.component';

describe('VoidRequestComponent', () => {
  let component: VoidRequestComponent;
  let fixture: ComponentFixture<VoidRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoidRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoidRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
