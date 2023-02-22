import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtCategoryListComponent } from './thought-category-list.component';

describe('ThoughtCategoryListComponent', () => {
  let component: ThoughtCategoryListComponent;
  let fixture: ComponentFixture<ThoughtCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
