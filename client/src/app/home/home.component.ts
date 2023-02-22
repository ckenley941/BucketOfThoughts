import { Component, OnInit, ViewChild } from "@angular/core";
import { DashboardRandomThoughtComponent } from "./dashboard/dashboard-random-thought/dashboard-random-thought.component";
import { DashboardRandomShowComponent } from "./dashboard/dashboard-random-show/dashboard-random-show.component";
import { DashboardStateFactComponent } from "./dashboard/dashboard-state-fact/dashboard-state-fact.component";

@Component({
  selector: "bot-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.less"],
})
export class HomeComponent implements OnInit {
  constructor() {}

  @ViewChild(DashboardRandomThoughtComponent)
  randomThought: DashboardRandomThoughtComponent;

  @ViewChild(DashboardStateFactComponent)
  stateFact: DashboardStateFactComponent;

  @ViewChild(DashboardRandomShowComponent)
  randomShow: DashboardRandomShowComponent;

  ngOnInit(): void {}

  public tabChanged = (event) => {
    console.log(event);
  };

  public refreshThought = () => {
    this.randomThought.getData();
  };

  public redirectToThought = () => {
    this.randomThought.goToDetails();
  };

  public refreshState = () => {
    this.stateFact.getData();
  };

  public refreshShow = () => {
    this.randomShow.getData();
    //Test
  };
}
