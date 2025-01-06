import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecommissionComponent } from './decommission.component';

describe('DecommissionComponent', () => {
  let component: DecommissionComponent;
  let fixture: ComponentFixture<DecommissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecommissionComponent]
    });
    fixture = TestBed.createComponent(DecommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
