import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "bot-nav-sidenav",
  templateUrl: "./nav-sidenav.component.html",
  styleUrls: ["./nav-sidenav.component.less"],
})
export class NavSidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };
}
