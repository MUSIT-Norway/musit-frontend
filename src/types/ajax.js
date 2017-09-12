// @flow
import { Observable } from 'rxjs';

export type Callback = { onComplete?: Function, onFailure?: Function };

export type AjaxPost = (
  url: string,
  data: mixed,
  token: string,
  callback: ?Callback
) => Observable<*>;

export type AjaxPut = (
  url: string,
  data: mixed,
  token: string,
  callback: ?Callback
) => Observable<*>;

export type AjaxDel = (url: string, token: string, callback: ?Callback) => Observable<*>;

export type AjaxGet = (url: string, token: string, callback: ?Callback) => Observable<*>;
