import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { CustomerService } from "../services/customer.service";
import { SharedDataService } from "../services/shared-data.service";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";

export const brokerGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const customerService = inject(CustomerService);
	const sharedDataService = inject(SharedDataService);

	const token = localStorage.getItem("token");

	if (!token) {
		router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
		return false;
	}

	return customerService.getCustomer().pipe(
		map((response: any) => {
			if (response.status && response.data.role === "Broker") {
				sharedDataService.setUserData(response.data);
				return true;
			}
			router.navigate(["/dashboard"]);
			return false;
		}),
		catchError(() => {
			router.navigate(["/dashboard"]);
			return of(false);
		})
	);
};
