import { Observable } from 'rxjs';
import 'rxjs/add/observable/dom/ajax';
import { hashHistory } from 'react-router';
import { emitError } from './errors';
import { setAccessToken$ } from '../modules/app/appSession';

export const onComplete = callback =>
  response => {
    if (callback && callback.onComplete) {
      callback.onComplete(response);
    }
  };

const shouldLog = function() {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
};

export const onFailure = callback =>
  error => {
    switch (error.status) {
      case 401:
        if (shouldLog()) {
          console.error('Unauthorized', error); // eslint-disable-line no-console
        }
        if (localStorage.getItem('accessToken')) {
          localStorage.removeItem('accessToken');
          setAccessToken$.next(null);
          hashHistory.push('/');
          emitError({ ...error, type: 'network' });
        }
        return Observable.empty();
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

export const ajax = (url, method, body, token, headers, responseType = 'json') =>
  Observable.ajax({
    url,
    responseType,
    method,
    body,
    headers: {
      Authorization: 'Bearer ' + token,
      ...headers
    }
  });

const simpleAjax = (ajax$, callback) =>
  ajax$.do(onComplete(callback)).catch(onFailure(callback));

export const get = (url, token) => ajax(url, 'GET', null, token);

export const simpleGet = (url, token, callback) => simpleAjax(get(url, token), callback);

export const del = (url, token) => ajax(url, 'DELETE', null, token);

export const simpleDel = (url, token, callback) => simpleAjax(del(url, token), callback);

export const post = (url, body, token) =>
  ajax(url, 'POST', body, token, { 'Content-Type': 'application/json' });

export const simplePost = (url, data, token, callback) =>
  simpleAjax(post(url, data, token), callback);

export const put = (url, data, token) =>
  ajax(url, 'PUT', data, token, { 'Content-Type': 'application/json' });

export const simplePut = (url, data, token, callback) =>
  simpleAjax(put(url, data, token), callback);
