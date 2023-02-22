import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { RepositoryService } from "./../../shared/services/repository.service";
import { ErrorHandlerService } from "./../../shared/services/error-handler-service.service";
import { Thought } from "../../models/thought.model";

@Component({
  selector: "bot-thought-list",
  templateUrl: "./thought-list.component.html",
  styleUrls: ["./thought-list.component.less"],
})
export class ThoughtListComponent implements OnInit {
  public displayedColumns = [
    "description",
    "thoughtCategoryId",
    "details",
    //"update",
    "delete",
  ];
  public dataSource = new MatTableDataSource<Thought>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private repoService: RepositoryService,
    private errorService: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  public loadData = () => {
    this.repoService.getData("api/thoughts").subscribe(
      (res) => {
        this.dataSource.data = res as Thought[];
      },
      (error) => {
        this.errorService.handleError(error);
      }
    );
  };

  public redirectToDetails = (id: number) => {
    let url: string = `/thought/details/${id}`;
    this.router.navigate([url]);
  };

  public redirectToUpdate = (id: string) => {};

  public redirectToDelete = (id: number) => {
    if (confirm("You really wanna delete that thought from your memory?")) {
      this.repoService.delete(`api/thoughts/${id}`).subscribe((res) => {
        this.loadData();
      });
    }
  };
}
