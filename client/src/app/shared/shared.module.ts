import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./../material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SuccessDialogComponent } from "./dialogs/success-dialog/success-dialog.component";
import { ErrorDialogComponent } from "./dialogs/error-dialog/error-dialog.component";

@NgModule({
  imports: [CommonModule, MaterialModule, FlexLayoutModule],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    SuccessDialogComponent,
    ErrorDialogComponent,
  ],
  entryComponents: [SuccessDialogComponent, ErrorDialogComponent],
  declarations: [SuccessDialogComponent, ErrorDialogComponent],
})
export class SharedModule {}
