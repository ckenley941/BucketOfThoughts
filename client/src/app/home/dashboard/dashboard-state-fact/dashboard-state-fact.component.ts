import { Component, OnInit } from "@angular/core";
import { RepositoryService } from "../../../shared/services/repository.service";
import { StateFact } from "../../../models/stateFact.model";

@Component({
  selector: "bot-dashboard-state-fact",
  templateUrl: "./dashboard-state-fact.component.html",
  styleUrls: ["./dashboard-state-fact.component.less"],
})
export class DashboardStateFactComponent implements OnInit {
  constructor(private repoService: RepositoryService) {}
  public stateFact: StateFact;
  //public routerLink: string;

  ngOnInit(): void {
    this.getData();
  }

  public getData = () => {
    this.repoService.getData("api/dashboards/GetStateFact").subscribe(
      (res) => {
        this.stateFact = res as StateFact;
        //this.routerLink = `/thought/details/${this.thought.thoughtId}`;
      },
      (error) => {
        //this.errorService.handleError(error);
      }
    );
  };
}
