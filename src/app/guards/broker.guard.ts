import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { CustomerService } from "../services/customer.service";

export const brokerGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const customerService = inject(CustomerService);

	const token = localStorage.getItem("token");

	if (!token) {
		router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
		return false;
	}

	customerService.getCustomer().subscribe({
		next: (response: any) => {
			if (response.status && response.data.role === "Broker") {
				return true;
			} else {
				router.navigate(["/dashboard"]);
				return false;
			}
		},
		error: () => {
			router.navigate(["/dashboard"]);
			return false;
		},
	});

	return true;
};
