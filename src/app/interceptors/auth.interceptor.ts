import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

	const token = localStorage.getItem('token');

	if (token) {
		const authReq = req.clone({
			headers: req.headers.set('Authorization', `Bearer ${token}`)
		});
		return next(authReq);
	}

	return next(req);
}
