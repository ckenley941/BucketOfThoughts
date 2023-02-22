import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MovieCastMember } from "./../../../models/movieCastMember.model";

@Component({
  selector: "bot-movie-cast-data",
  templateUrl: "./movie-cast-data.component.html",
  styleUrls: ["./movie-cast-data.component.less"],
})
export class MovieCastDataComponent implements OnInit {
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
    this.deleteRow.emit(this.castMember);
  };
}
