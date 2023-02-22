import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtDetailsComponent } from './thought-details.component';

describe('ThoughtDetailsComponent', () => {
  let component: ThoughtDetailsComponent;
  let fixture: ComponentFixture<ThoughtDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
