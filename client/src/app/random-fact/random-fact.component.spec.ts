import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomFactComponent } from './random-fact.component';

describe('RandomFactComponent', () => {
  let component: RandomFactComponent;
  let fixture: ComponentFixture<RandomFactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomFactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
