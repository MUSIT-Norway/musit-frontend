import {Observable} from 'rxjs';
import 'rxjs/add/observable/dom/ajax';
import { hashHistory } from 'react-router';
import { emitError } from '../shared/errors';
import { actions } from '../modules/app/appSession';

const ajax = (url, method, body, headers) =>
  Observable.ajax({
    url,
    responseType: 'json',
    method,
    body,
    headers: {
      ...headers
    }
  });


export const get = (url, token) => ajax(url, 'GET', null, {
  'Authorization': 'Bearer ' + token
});

export const del = (url, token) => ajax(url, 'DELETE', null, {
  'Authorization': 'Bearer ' + token
});

export const post = (url, body, token) => ajax(url, 'POST', body, {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
});

export const put = (url, body, token) => ajax(url, 'PUT', body, {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
});

export const onComplete = (cmd) => (response) => {
  if (cmd.onComplete) {
    cmd.onComplete(response);
  }
};

export const onFailure = (cmd) => (error) => {
  if (error.status === 401) {
    localStorage.removeItem('accessToken');
    actions.setAccessToken$.next(null);
    hashHistory.push('/');
    emitError({ ...error, type: 'network'});
  } else
  if (cmd.onFailure) {
    cmd.onFailure(error);
  }

  return Observable.of((state) => ({...state, error}));
};

export const toResponse = ({ response }) => response;