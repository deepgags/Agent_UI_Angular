import { Component } from "@angular/core";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";

interface Product {
	code: string;
	name: string;
	category: string;
	quantity: number;
}

@Component({
	selector: "app-admin",
	standalone: true,
	imports: [TableModule, CardModule],
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"],
})
export class AdminComponent {
	products: Product[] = [
		{ code: "P1001", name: "Laptop", category: "Electronics", quantity: 12 },
		{ code: "P1002", name: "Phone", category: "Electronics", quantity: 30 },
		{ code: "P1003", name: "Shirt", category: "Clothing", quantity: 45 },
		{ code: "P1004", name: "Book", category: "Stationery", quantity: 20 },
		{ code: "P1005", name: "Shoes", category: "Footwear", quantity: 15 },
	];
}
