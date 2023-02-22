import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRandomThoughtComponent } from './dashboard-random-thought.component';

describe('DashboardRandomThoughtComponent', () => {
  let component: DashboardRandomThoughtComponent;
  let fixture: ComponentFixture<DashboardRandomThoughtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardRandomThoughtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRandomThoughtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
