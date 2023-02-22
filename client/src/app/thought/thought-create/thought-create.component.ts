import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RepositoryService } from "../../shared/services/repository.service";
import { MatDialog } from "@angular/material/dialog";
import { Location } from "@angular/common";
import { SuccessDialogComponent } from "../../shared/dialogs/success-dialog/success-dialog.component";
import { ErrorHandlerService } from "../../shared/services/error-handler-service.service";
import { ThoughtCategory } from "../../models/thoughtCategory.model";

@Component({
  selector: "bot-thought-create",
  templateUrl: "./thought-create.component.html",
  styleUrls: ["./thought-create.component.less"],
})
export class ThoughtCreateComponent implements OnInit {
  public thoughtForm: FormGroup;
  public categories: any[];
  public selectedCategory;
  private dialogConfig;

  constructor(
    private location: Location,
    private repoService: RepositoryService,
    private dialog: MatDialog,
    private errorService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.thoughtForm = new FormGroup({
      description: new FormControl("", [
        Validators.required,
        //Validators.maxLength(60),
      ]),
      category: new FormControl("", [Validators.required]),
      isQuote: new FormControl(false),
      timelineDateFrom: new FormControl(),
      timelineDateTo: new FormControl(),
    });

    this.dialogConfig = {
      height: "200px",
      width: "400px",
      disableClose: true,
      data: {},
    };

    this.loadCategories();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.thoughtForm.controls[controlName].hasError(errorName);
  };

  public onCancel = () => {
    this.location.back();
  };

  public loadCategories = () => {
    this.repoService.getData("api/thoughtCategories").subscribe(
      (res) => {
        this.categories = res as ThoughtCategory[];
      },
      (error) => {
        this.errorService.handleError(error);
      }
    );
  };

  public addThought = (thoughtFormValue) => {
    if (this.thoughtForm.valid) {
      let thought = {
        thoughtId: 0,
        description: thoughtFormValue.description,
        thoughtCategoryId: thoughtFormValue.category,
        isQuote: thoughtFormValue.isQuote,
        timeline: {},
      };
      if (thoughtFormValue.timelineDateFrom !== null) {
        thought.timeline = {
          dateStart: thoughtFormValue.timelineDateFrom,
          dateEnd: thoughtFormValue.timelineDateTo,
        };
      }

      this.repoService.create("api/thoughts", thought).subscribe(
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
}
