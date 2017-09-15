// @flow
import { Observable } from 'rxjs';

export type Callback<R> = {
  onComplete?: (r: ?R) => mixed,
  onFailure?: (error: { status: number }) => mixed
};

export type AjaxPost<R> = (
  url: string,
  data: mixed,
  token: string,
  callback: ?Callback<R>
) => Observable<R>;

export type AjaxPut<R> = (
  url: string,
  data: mixed,
  token: string,
  callback: ?Callback<R>
) => Observable<R>;

export type AjaxDel<R> = (
  url: string,
  token: string,
  callback: ?Callback<R>
) => Observable<R>;

export type AjaxGet<R> = (
  url: string,
  token: string,
  callback: ?Callback<R>
) => Observable<R>;
