import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//i.test(req.url)) return next(req);
  const url = `${environment.apiBase}${req.url.startsWith('/') ? '' : '/'}${
    req.url
  }`;
  return next(req.clone({ url }));
};
