import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trad2Component } from './trad2.component';

describe('Trad2Component', () => {
  let component: Trad2Component;
  let fixture: ComponentFixture<Trad2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Trad2Component]
    });
    fixture = TestBed.createComponent(Trad2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
