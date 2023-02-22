import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "bot-nav-header",
  templateUrl: "./nav-header.component.html",
  styleUrls: ["./nav-header.component.less"],
})
export class NavHeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
