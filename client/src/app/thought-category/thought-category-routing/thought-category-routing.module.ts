import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ThoughtCategoryCreateComponent } from "../thought-category-create/thought-category-create.component";
import { ThoughtCategoryListComponent } from "../thought-category-list/thought-category-list.component";

const routes: Routes = [
  { path: "list", component: ThoughtCategoryListComponent },
  //{ path: "details/:id", component: ThoughtDetailsComponent },
  { path: "create", component: ThoughtCategoryCreateComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThoughtCategoryRoutingModule {}
