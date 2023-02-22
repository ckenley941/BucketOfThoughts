import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MovieCastMember } from "./../../models/movieCastMember.model";

@Component({
  selector: "bot-movie-cast-member-data",
  templateUrl: "./movie-cast-member-data.component.html",
  styleUrls: ["./movie-cast-member-data.component.less"],
})
export class MovieCastMemberDataComponent implements OnInit {
  public movieCastForm: FormGroup;
  public isEdit: Boolean;

  @Input() public castMember: MovieCastMember;
  @Output() deleteRow = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.isEdit =
      this.castMember.celebrityName === null &&
      this.castMember.characterName === null;

    this.movieCastForm = new FormGroup({
      celebrityName: new FormControl(""),
      characterName: new FormControl(""),
    });
    this.movieCastForm.patchValue(this.castMember);
  }

  public setEditMode = () => {
    this.isEdit = !this.isEdit;
  };

  public delete = () => {
    if (confirm("Are you sure you want to delete this row?")) {
      this.deleteRow.emit(this.castMember);
    }
  };
}
