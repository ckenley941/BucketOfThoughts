import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ThoughtCategoryCreateComponent } from "./thought-category-create.component";

describe("ThoughtCategoryComponent", () => {
  let component: ThoughtCategoryCreateComponent;
  let fixture: ComponentFixture<ThoughtCategoryCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThoughtCategoryCreateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtCategoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
