import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "../shared/shared.module";
import { ThoughtCategoryRoutingModule } from "./thought-category-routing/thought-category-routing.module";

import { ThoughtCategoryCreateComponent } from "./thought-category-create/thought-category-create.component";
import { ThoughtCategoryListComponent } from "./thought-category-list/thought-category-list.component";

@NgModule({
  declarations: [ThoughtCategoryCreateComponent, ThoughtCategoryListComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ThoughtCategoryRoutingModule,
  ],
})
export class ThoughtCategoryModule {}
