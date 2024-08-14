import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradComponent } from './trad.component';

describe('TradComponent', () => {
  let component: TradComponent;
  let fixture: ComponentFixture<TradComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradComponent]
    });
    fixture = TestBed.createComponent(TradComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
