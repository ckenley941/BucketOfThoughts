import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStateFactComponent } from './dashboard-state-fact.component';

describe('DashboardStateFactComponent', () => {
  let component: DashboardStateFactComponent;
  let fixture: ComponentFixture<DashboardStateFactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardStateFactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardStateFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
