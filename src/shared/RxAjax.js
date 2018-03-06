// @flow
import { Observable } from 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';
import { emitError } from './errors';
import { closeModal } from './modal';
import { setAccessToken$ } from '../stores/appSession';
import type { Callback, AjaxGet, AjaxPost, AjaxPut, AjaxDel } from '../types/ajax';

export function onComplete<R>(callback: ?Callback<R>) {
  return (response: R) => {
    if (callback && callback.onComplete) {
      callback.onComplete(response);
    }
  };
}

const shouldLog = function() {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
};

export function onFailure<R>(callback: ?Callback<R>): (error: *) => Observable<*> {
  return (error: *) => {
    switch (error.status) {
      case 401:
        if (shouldLog()) {
          console.error('Unauthorized', error); // eslint-disable-line no-console
        }
        if (localStorage.getItem('accessToken')) {
          localStorage.removeItem('accessToken');
          setAccessToken$.next(null);
          window.location.replace('/');
          emitError({ ...error, type: 'network' });
        }
        closeModal();
        return Observable.empty();
      case 403:
        if (shouldLog()) {
          console.error('Not access to collection', error); // eslint-disable-line no-console
        }
        break;
      default:
        break;
    }

    if (callback && callback.onFailure) {
      callback.onFailure(error);
    }

    if (shouldLog()) {
      console.error(error); // eslint-disable-line no-console
    }

    return Observable.of({ error });
  };
}

export function ajaxHelper<R, B>(
  url: string,
  method: string,
  body: B,
  token: string,
  headers: ?{ [string]: string },
  responseType?: ?string = 'json'
): Observable<R> {
  return ajax({
    url,
    responseType,
    method,
    body,
    headers: {
      Authorization: 'Bearer ' + token,
      ...headers
    }
  });
}

function simpleAjax<R>(ajax$: Observable<R>, callback: ?Callback<R>): Observable<R> {
  return ajax$.do(onComplete(callback)).catch(onFailure(callback));
}

export function get<R>(url: string, token: string): Observable<R> {
  return ajaxHelper(url, 'GET', null, token);
}

export const simpleGet: AjaxGet<*> = function simpleGet<R>(
  url: string,
  token: string,
  callback: ?Callback<R>
): Observable<R> {
  console.log('SIMPLEGET ' + url);
  return simpleAjax(get(url, token), callback);
};

export function del<R>(url: string, token: string): Observable<R> {
  return ajaxHelper(url, 'DELETE', null, token);
}

export const simpleDel: AjaxDel<*> = function<R>(
  url: string,
  token: string,
  callback: ?Callback<R>
): Observable<R> {
  return simpleAjax(del(url, token), callback);
};

export function post<B, R>(url: string, body: B, token: string): Observable<R> {
  return ajaxHelper(url, 'POST', body, token, { 'Content-Type': 'application/json' });
}

export const simplePost: AjaxPost<*> = function<B, R>(
  url: string,
  data: B,
  token: string,
  callback: ?Callback<R>
): Observable<R> {
  return simpleAjax(post(url, data, token), callback);
};

export function put<B, R>(url: string, data: B, token: string): Observable<R> {
  return ajaxHelper(url, 'PUT', data, token, { 'Content-Type': 'application/json' });
}

export const simplePut: AjaxPut<*> = function<B, R>(
  url: string,
  data: B,
  token: string,
  callback: ?Callback<R>
): Observable<R> {
  return simpleAjax(put(url, data, token), callback);
};
