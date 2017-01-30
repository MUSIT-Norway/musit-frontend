import {Observable} from 'rxjs';
import 'rxjs/add/observable/dom/ajax';
import { hashHistory } from 'react-router';
import { emitError } from './errors';
import { actions } from '../modules/app/appSession';

export const onComplete = (callback) => (response) => {
  if (callback && callback.onComplete) {
    callback.onComplete(response);
  }
};

export const onFailure = (callback) => (error) => {
  if (error.status === 401) {
    localStorage.removeItem('accessToken');
    actions.setAccessToken$.next(null);
    hashHistory.push('/');
    emitError({ ...error, type: 'network'});
  } else if (callback && callback.onFailure) {
    callback.onFailure(error);
  }
  return Observable.of((state) => ({...state, error}));
};

export const toResponse = ({ response }) => response;

const ajax = (url, method, body, token, headers) =>
  Observable.ajax({
    url,
    responseType: 'json',
    method,
    body,
    headers: {
      'Authorization': 'Bearer ' + token,
      ...headers
    }
  });

const simpleAjax = (ajax$, callback) =>
  ajax$.map(toResponse)
    .do(onComplete(callback))
    .catch(onFailure(callback));

export const get = (url, token) => ajax(url, 'GET', null, token);

export const simpleGet = (url, token, callback) => simpleAjax(get(url, token), callback);

export const del = (url, token) => ajax(url, 'DELETE', null, token);

export const simpleDel = (url, token, callback) => simpleAjax(del(url, token), callback);

export const post = (url, body, token) => ajax(url, 'POST', body, token, { 'Content-Type': 'application/json' });

export const simplePost = (url, data, token, callback) => simpleAjax(post(url, data, token), callback);

export const put = (url, data, token) => ajax(url, 'PUT', data, token, { 'Content-Type': 'application/json' });

export const simplePut = (url, data, token, callback) => simpleAjax(put(url, data, token), callback);