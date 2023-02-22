import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRandomShowComponent } from './dashboard-random-show.component';

describe('DashboardRandomShowComponent', () => {
  let component: DashboardRandomShowComponent;
  let fixture: ComponentFixture<DashboardRandomShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardRandomShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRandomShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
