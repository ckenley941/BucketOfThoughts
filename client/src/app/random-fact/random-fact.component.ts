import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "bot-random-fact",
  templateUrl: "./random-fact.component.html",
  styleUrls: ["./random-fact.component.less"],
})
export class RandomFactComponent implements OnInit {
  fact: any;

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.fact = {
      name: "Prepopulated Data",
      category: "",
    };
    this.route.paramMap.subscribe((params) => {
      console.log(+params.get("randomFactId"));
    });
    //
  }

  save(): boolean {
    alert("Fact name: " + this.fact.name);
    console.log(this.fact);
    return true;
  }
}
