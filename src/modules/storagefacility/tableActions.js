import { Observable, Subject } from 'rxjs';
import { get as ajaxGet, del as ajaxDelete } from '../../state/ajax';
import Config from '../../config';

const onComplete = (cmd) => (response) => {
  if (cmd.onComplete) {
    cmd.onComplete(response);
  }
};

const onFailure = (cmd) => (error) => {
  if (cmd.onFailure) {
    cmd.onFailure(error);
  }
  return Observable.of((state) => state);
};

const toResponse = ({ response }) => response;

export const clearRootNode$ = new Subject();
export const setLoading$ = new Subject();

export const loadNodes$ = new Subject().map(cmd => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(cmd.museumId);
  let url;
  if (cmd.nodeId) {
    url = `${baseUrl}/${cmd.nodeId}/children?page=${cmd.page?cmd.page:1}&limit=${Config.magasin.limit}`;
  } else {
    url = `${baseUrl}/root`;
  }
  return { ...cmd, url };
});

export const loadObjects$ = new Subject().map(cmd => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(cmd.museumId);
  const url = `${baseUrl}/node/${cmd.nodeId}/objects?${cmd.collectionId.getQuery()}&page=${cmd.page || 1}&limit=${Config.magasin.limit}`;
  return { ...cmd, url };
});

export const loadChildren$ = Observable.merge(loadNodes$, loadObjects$).switchMap((cmd) => {
  return ajaxGet(cmd.url, cmd.token)
    .map(toResponse)
    .do(onComplete(cmd))
    .catch(onFailure(cmd));
});

export const loadStats$ = new Subject().switchMap((cmd) => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(cmd.museumId);
  return ajaxGet(`${baseUrl}/storagenodes/${cmd.nodeId}/stats`, cmd.token)
    .map(toResponse)
    .do(onComplete(cmd))
    .catch(onFailure(cmd));
});

export const loadRootNode$ = new Subject().switchMap((cmd) => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(cmd.museumId);
  return ajaxGet(`${baseUrl}/${cmd.nodeId}`, cmd.token)
    .map(toResponse)
    .do(onComplete(cmd))
    .catch(onFailure(cmd));
});

export const deleteNode$ = new Subject().flatMap((cmd) => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(cmd.museumId);
  return ajaxDelete(`${baseUrl}/${cmd.nodeId}`, cmd.token)
    .map(toResponse)
    .do(onComplete(cmd))
    .catch(onFailure(cmd));
});
