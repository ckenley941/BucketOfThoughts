import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Thought } from "./../../../models/thought.model";

@Component({
  selector: "bot-thought-data",
  templateUrl: "./thought-data.component.html",
  styleUrls: ["./thought-data.component.less"],
})
export class ThoughtDataComponent implements OnInit {
  @Input() public thought: Thought;
  @Output() selectEmitt = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
