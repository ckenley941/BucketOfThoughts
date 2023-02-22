import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RepositoryService } from "../../shared/services/repository.service";
import { MatDialog } from "@angular/material/dialog";
import { Location } from "@angular/common";
import { SuccessDialogComponent } from "../../shared/dialogs/success-dialog/success-dialog.component";
import { ErrorHandlerService } from "../../shared/services/error-handler-service.service";
import { ThoughtCategory } from "../../models/thoughtCategory.model";

@Component({
  selector: "bot-thought-category-create",
  templateUrl: "./thought-category-create.component.html",
  styleUrls: ["./thought-category-create.component.less"],
})
export class ThoughtCategoryCreateComponent implements OnInit {
  public thoughtCategoryForm: FormGroup;
  public categories: any[];
  public selectedParentCategory;
  private dialogConfig;

  constructor(
    private location: Location,
    private repoService: RepositoryService,
    private dialog: MatDialog,
    private errorService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.thoughtCategoryForm = new FormGroup({
      description: new FormControl("", [Validators.required]),
      parentCategory: new FormControl(""),
      sortOrder: new FormControl(0),
    });

    this.loadCategories();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.thoughtCategoryForm.controls[controlName].hasError(errorName);
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

  public addThoughtCategory = (thoughtCategoryFormValue) => {
    if (this.thoughtCategoryForm.valid) {
      let thoughtCategory = {
        thoughtCategoryId: 0,
        description: thoughtCategoryFormValue.description,
        parentId: thoughtCategoryFormValue.parentCategory,
        sortOrder: thoughtCategoryFormValue.sortOrder,
      };

      this.repoService
        .create("api/thoughtcategories", thoughtCategory)
        .subscribe(
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
