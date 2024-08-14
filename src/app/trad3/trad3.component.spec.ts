import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trad3Component } from './trad3.component';

describe('Trad3Component', () => {
  let component: Trad3Component;
  let fixture: ComponentFixture<Trad3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Trad3Component]
    });
    fixture = TestBed.createComponent(Trad3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
