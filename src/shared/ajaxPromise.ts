import { TODO } from '../types/common';

function makeRequest(opts: TODO) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method, opts.url);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    if (opts.headers) {
      Object.keys(opts.headers).forEach(function(key) {
        xhr.setRequestHeader(key, opts.headers[key]);
      });
    }
    var params = opts.params;
    // We'll need to stringify if we've been given an object
    // If we have a string, this is skipped.
    if (params && typeof params === 'object') {
      params = Object.keys(params)
        .map(function(key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        })
        .join('&');
    }
    xhr.send(params);
  });
}

export function ajaxGetRequest(url: string, token: string) {
  return makeRequest({
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
    url: url
  });
}
