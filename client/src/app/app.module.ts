import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { SharedModule } from "./shared/shared.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

import { RandomFactComponent } from "./random-fact/random-fact.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { LayoutComponent } from "./layout/layout.component";
import { HomeComponent } from "./home/home.component";
import { NavHeaderComponent } from "./navigation/nav-header/nav-header.component";
import { NavSidenavComponent } from "./navigation/nav-sidenav/nav-sidenav.component";
import { NotFoundComponent } from "./error-pages/not-found/not-found.component";
import { ServerErrorComponent } from "./error-pages/server-error/server-error.component";
import { DashboardStateFactComponent } from "./home/dashboard/dashboard-state-fact/dashboard-state-fact.component";
import { DashboardRandomThoughtComponent } from "./home/dashboard/dashboard-random-thought/dashboard-random-thought.component";
import { DashboardRandomShowComponent } from './home/dashboard/dashboard-random-show/dashboard-random-show.component';

@NgModule({
  declarations: [
    AppComponent,
    RandomFactComponent,
    MainMenuComponent,
    LayoutComponent,
    HomeComponent,
    NavHeaderComponent,
    NavSidenavComponent,
    NotFoundComponent,
    ServerErrorComponent,
    DashboardStateFactComponent,
    DashboardRandomThoughtComponent,
    DashboardRandomShowComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
