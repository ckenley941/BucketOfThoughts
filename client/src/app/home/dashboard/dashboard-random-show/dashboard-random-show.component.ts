import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RepositoryService } from "../../../shared/services/repository.service";
import { Show } from "../../../models/show.model";

@Component({
  selector: "bot-dashboard-random-show",
  templateUrl: "./dashboard-random-show.component.html",
  styleUrls: ["./dashboard-random-show.component.less"],
})
export class DashboardRandomShowComponent implements OnInit {
  constructor(private repoService: RepositoryService, private router: Router) {}

  public show: Show;
  public routerLink: string;

  ngOnInit(): void {
    this.getData();
  }

  public getData = () => {
    this.repoService.getData("api/dashboards/GetRandomShow").subscribe(
      (res) => {
        this.show = res as Show;
        console.log(this.show);
      },
      (error) => {
        //this.errorService.handleError(error);
      }
    );
  };
}

/*
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RepositoryService } from "../../../shared/services/repository.service";
import { Thought } from "../../../models/thought.model";

@Component({
  selector: "bot-dashboard-random-thought",
  templateUrl: "./dashboard-random-thought.component.html",
  styleUrls: ["./dashboard-random-thought.component.less"],
})
export class DashboardRandomThoughtComponent implements OnInit {
  constructor(private repoService: RepositoryService, private router: Router) {}

  public thought: Thought;
  public routerLink: string;

  ngOnInit(): void {
    this.getThought();
  }

  public getThought = () => {
    this.repoService.getData("api/dashboards/GetRandomThought").subscribe(
      (res) => {
        this.thought = res as Thought;
        console.log(this.thought);
        this.routerLink = `/thought/details/${this.thought.thoughtId}`;
      },
      (error) => {
        //this.errorService.handleError(error);
      }
    );
  };

  public goToDetails = () => {
    let url: string = `/thought/details/${this.thought.thoughtId}`;
    this.router.navigate([url]);
  };
}

*/
