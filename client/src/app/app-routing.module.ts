import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NotFoundComponent } from "./error-pages/not-found/not-found.component";
import { ServerErrorComponent } from "./error-pages/server-error/server-error.component";
import { HomeComponent } from "./home/home.component";
import { ThoughtModule } from "./thought/thought.module";
import { ThoughtCategoryModule } from "./thought-category/thought-category.module";
import { MovieModule } from "./movie/movie.module";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  {
    path: "thought",
    loadChildren: () =>
      import("./thought/thought.module").then((m) => m.ThoughtModule),
  },
  {
    path: "thought-category",
    loadChildren: () =>
      import("./thought-Category/thought-Category.module").then(
        (m) => m.ThoughtCategoryModule
      ),
  },
  {
    path: "movie",
    loadChildren: () =>
      import("./movie/movie.module").then((m) => m.MovieModule),
  },
  { path: "404", component: NotFoundComponent },
  { path: "500", component: ServerErrorComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/404", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
