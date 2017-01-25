import {Observable} from 'rxjs';
import 'rxjs/add/observable/dom/ajax';

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
  if (cmd.onFailure) {
    cmd.onFailure(error);
  }
  return Observable.of((state) => ({...state, error}));
};

export const toResponse = ({ response }) => response;