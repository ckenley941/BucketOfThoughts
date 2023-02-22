import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtDataComponent } from './thought-data.component';

describe('ThoughtDataComponent', () => {
  let component: ThoughtDataComponent;
  let fixture: ComponentFixture<ThoughtDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
