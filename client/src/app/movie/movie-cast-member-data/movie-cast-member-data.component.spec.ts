import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCastMemberDataComponent } from './movie-cast-member-data.component';

describe('MovieCastMemberDataComponent', () => {
  let component: MovieCastMemberDataComponent;
  let fixture: ComponentFixture<MovieCastMemberDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieCastMemberDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieCastMemberDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
