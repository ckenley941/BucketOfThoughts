import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCastDataComponent } from './movie-cast-data.component';

describe('MovieCastDataComponent', () => {
  let component: MovieCastDataComponent;
  let fixture: ComponentFixture<MovieCastDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieCastDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieCastDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
