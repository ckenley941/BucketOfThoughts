import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "../shared/shared.module";
import { ThoughtListComponent } from "./thought-list/thought-list.component";
import { ThoughtRoutingModule } from "./thought-routing/thought-routing.module";
import { ThoughtCreateComponent } from "./thought-create/thought-create.component";
import { ThoughtDetailsComponent } from "./thought-details/thought-details.component";
import { ThoughtDataComponent } from "./thought-details/thought-data/thought-data.component";

@NgModule({
  declarations: [
    ThoughtListComponent,
    ThoughtCreateComponent,
    ThoughtDetailsComponent,
    ThoughtDataComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ThoughtRoutingModule,
  ],
})
export class ThoughtModule {}
