import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { RepositoryService } from "../../shared/services/repository.service";
import { ErrorHandlerService } from "../../shared/services/error-handler-service.service";
import { Thought } from "../../models/thought.model";

@Component({
  selector: "bot-thought-details",
  templateUrl: "./thought-details.component.html",
  styleUrls: ["./thought-details.component.less"],
})
export class ThoughtDetailsComponent implements OnInit {
  public thought: Thought;

  constructor(
    private repoService: RepositoryService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.getThoughtDetails();
  }

  private getThoughtDetails = () => {
    let id: string = this.activeRoute.snapshot.params["id"];

    this.repoService.getData(`api/thoughts/${id}`).subscribe(
      (res) => {
        this.thought = res as Thought;
        console.log(this.thought.thoughtDetail);
      },
      (error) => {
        this.errorHandler.handleError(error);
      }
    );
  };
}
