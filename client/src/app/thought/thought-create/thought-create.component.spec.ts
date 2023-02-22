import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtCreateComponent } from './thought-create.component';

describe('ThoughtCreateComponent', () => {
  let component: ThoughtCreateComponent;
  let fixture: ComponentFixture<ThoughtCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
