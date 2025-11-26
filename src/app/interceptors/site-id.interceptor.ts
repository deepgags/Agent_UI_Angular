import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { SharedDataService } from "../services/shared-data.service";

export function SiteIdInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
	const sharedDataService = inject(SharedDataService);
	const siteId = sharedDataService.siteId();

	if (siteId) {
		const siteIdReq = req.clone({
			headers: req.headers.set("site-id", siteId),
		});
		return next(siteIdReq);
	}

	return next(req);
}
