import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../environments/environment.development";
import { CustomerModel } from "../models/CustomerModel";
import { InterestedUserModel } from "../models/InterestedUserModel";
import { StorageService } from "./storage.service";

@Injectable({
	providedIn: "root",
})
export class InterestedUserService {
	private Apiurl: string = "";

	constructor(private http: HttpClient, private storageService: StorageService) {
		this.Apiurl = environment.agentApiUrl + environment.interestedUserUrl;
	}

	save(user: InterestedUserModel) {
		return this.http.post(this.Apiurl + "/save", user);
	}
}
