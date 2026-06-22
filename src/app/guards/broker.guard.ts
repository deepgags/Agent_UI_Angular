import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { CustomerService } from "../services/customer.service";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";

export const brokerGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const customerService = inject(CustomerService);

	const token = localStorage.getItem("token");

	if (!token) {
		router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
		return false;
	}

	return customerService.getCustomer().pipe(
		map((response: any) => {
			if (response.status && response.data.isBroker === true) {
				return true;
			}
			router.navigate(["/dashboard"]);
			return true;
		}),
		catchError(() => {
			router.navigate(["/dashboard"]);
			return of(false);
		})
	);
};
