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

export const post = (url, body, token) => ajax(url, 'POST', body, {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
});

export const put = (url, body, token) => ajax(url, 'PUT', body, {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
});