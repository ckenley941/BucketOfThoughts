import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RepositoryService } from "../../shared/services/repository.service";
import { MatDialog } from "@angular/material/dialog";
import { Location } from "@angular/common";
import { SuccessDialogComponent } from "../../shared/dialogs/success-dialog/success-dialog.component";
import { ErrorHandlerService } from "../../shared/services/error-handler-service.service";
import { Movie } from "../../models/movie.model";
import { MovieCastMember } from "../../models/MovieCastMember.model";
import { Guid } from "../../utils/Guid";

@Component({
  selector: "bot-movie-create",
  templateUrl: "./movie-create.component.html",
  styleUrls: ["./movie-create.component.less"],
})
export class MovieCreateComponent implements OnInit {
  public movieForm: FormGroup;
  public movieCast: MovieCastMember[];
  public testVar;
  private dialogConfig;

  constructor(
    private location: Location,
    private repoService: RepositoryService,
    private dialog: MatDialog,
    private errorService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.movieForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      director: new FormControl(""),
      year: new FormControl(0),
      description: new FormControl(""),
      lastSeenDate: new FormControl(),
      isFavorite: new FormControl(false),
      onWatchlist: new FormControl(false),
    });
    this.movieCast = [];
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.movieForm.controls[controlName].hasError(errorName);
  };

  public onCancel = () => {
    this.location.back();
  };

  public addMovie = (movieFormValue) => {
    if (this.movieForm.valid) {
      //let movie = movieFormValue;
      //movie.movieCastMember = this.movieCast;
      //add actors

      this.repoService.create("api/movies", movieFormValue).subscribe(
        () => {
          let dialogRef = this.dialog.open(
            SuccessDialogComponent,
            this.dialogConfig
          );

          //we are subscribing on the [mat-dialog-close] attribute as soon as we click on the dialog button
          dialogRef.afterClosed().subscribe((result) => {
            this.location.back();
          });
        },
        (error) => {
          this.errorService.dialogConfig = { ...this.dialogConfig };
          this.errorService.handleError(error);
        }
      );
    }
  };

  public addCastMember = () => {
    this.movieCast.push({
      movieCastMemberId: 0,
      movieCastMemberGuid: Guid.newGuid().toString(),
      celebrityName: null,
      characterName: null,
    });
  };

  public deleteCastMember = (row) => {
    this.movieCast = this.movieCast.filter(
      (x) => x.movieCastMemberGuid !== row.movieCastMemberGuid
    );
  };
}
