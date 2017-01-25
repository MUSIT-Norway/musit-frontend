import {Observable} from 'rxjs';
import 'rxjs/add/observable/dom/ajax';

export const onComplete = (cmd) => (response) => {
  if (cmd.onComplete) {
    cmd.onComplete(response);
  }
};

export const onFailure = (cmd) => (error) => {
  if (cmd.onFailure) {
    cmd.onFailure(error);
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

export const simplePost = (url, token, callback) => simpleAjax(post(url, token), callback);

export const put = (url, body, token) => ajax(url, 'PUT', body, token, { 'Content-Type': 'application/json' });

export const simplePut = (url, token, callback) => simpleAjax(put(url, token), callback);