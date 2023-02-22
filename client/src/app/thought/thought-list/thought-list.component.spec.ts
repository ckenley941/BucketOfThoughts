import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtListComponent } from './thought-list.component';

describe('ThoughtListComponent', () => {
  let component: ThoughtListComponent;
  let fixture: ComponentFixture<ThoughtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
