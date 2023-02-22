import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { MovieCreateComponent } from "../movie-create/movie-create.component";

const routes: Routes = [{ path: "create", component: MovieCreateComponent }];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovieRoutingModule {}
