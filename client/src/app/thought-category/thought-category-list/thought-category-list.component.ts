import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { RepositoryService } from "./../../shared/services/repository.service";
import { ErrorHandlerService } from "./../../shared/services/error-handler-service.service";
import { ThoughtCategory } from "../../models/thoughtCategory.model";

@Component({
  selector: "bot-thought-category-list",
  templateUrl: "./thought-category-list.component.html",
  styleUrls: ["./thought-category-list.component.less"],
})
export class ThoughtCategoryListComponent implements OnInit {
  public displayedColumns = [
    "description",
    "sortOrder",
    "details",
    //"update",
    "delete",
  ];
  public dataSource = new MatTableDataSource<ThoughtCategory>();
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
    this.repoService.getData("api/thoughtCategories").subscribe(
      (res) => {
        this.dataSource.data = res as ThoughtCategory[];
        console.log(this.dataSource.data);
      },
      (error) => {
        this.errorService.handleError(error);
      }
    );
  };

  public redirectToDetails = (id: number) => {
    let url: string = `/thoughtCategory/details/${id}`;
    this.router.navigate([url]);
  };

  public redirectToUpdate = (id: string) => {};

  public redirectToDelete = (id: number) => {
    if (
      confirm(
        "You really wanna delete that category? It might fuck up some data."
      )
    ) {
      this.repoService
        .delete(`api/thoughtCategories/${id}`)
        .subscribe((res) => {
          this.loadData();
        });
    }
  };
}
