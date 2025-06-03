import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
	debugger;
	const router = inject(Router);

	const token = localStorage.getItem("token");

	if (token) {
		return true;
	}

	router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
	return false;
};
