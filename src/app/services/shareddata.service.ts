import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CustomerModel } from "../models/CustomerModel";

@Injectable({
	providedIn: "root",
})
export class SharedDataService {
	private dataSource = new BehaviorSubject<any>(null);
	CustomerData = this.dataSource.asObservable(); //new CustomerModel();//

	changeData(data: any) {
		//this.CustomerData = data;
		this.dataSource.next(data);
	}
}
