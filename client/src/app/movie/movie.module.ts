import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "../shared/shared.module";
import { MovieRoutingModule } from "../movie/movie-routing/movie-routing.module";
import { MovieCreateComponent } from "./movie-create/movie-create.component";
import { MovieCastMemberDataComponent } from "./movie-cast-member-data/movie-cast-member-data.component";

@NgModule({
  declarations: [MovieCreateComponent, MovieCastMemberDataComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MovieRoutingModule,
  ],
})
export class MovieModule {}
