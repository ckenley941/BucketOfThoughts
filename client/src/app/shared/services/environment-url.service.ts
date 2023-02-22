import { Injectable } from "@angular/core";
import { environment } from "./../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class EnvironmentUrlService {
  public apiBaseUrl: string = environment.urlAddress;
  constructor() {}
}
