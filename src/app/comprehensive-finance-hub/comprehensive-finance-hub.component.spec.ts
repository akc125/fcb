import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensiveFinanceHubComponent } from './comprehensive-finance-hub.component';

describe('ComprehensiveFinanceHubComponent', () => {
  let component: ComprehensiveFinanceHubComponent;
  let fixture: ComponentFixture<ComprehensiveFinanceHubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComprehensiveFinanceHubComponent]
    });
    fixture = TestBed.createComponent(ComprehensiveFinanceHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
