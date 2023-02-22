import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ThoughtListComponent } from "../thought-list/thought-list.component";
import { ThoughtCreateComponent } from "../thought-create/thought-create.component";
import { ThoughtDetailsComponent } from "../thought-details/thought-details.component";

const routes: Routes = [
  { path: "list", component: ThoughtListComponent },
  { path: "details/:id", component: ThoughtDetailsComponent },
  { path: "create", component: ThoughtCreateComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThoughtRoutingModule {}
