import { Observable, Subject } from 'rxjs';
import { simpleDel, simpleGet } from '../../rxjs/ajax';
import Config from '../../config';

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

export const loadChildren$ = Observable.merge(loadNodes$, loadObjects$).switchMap((cmd) =>
  simpleGet(cmd.url, cmd.token, cmd)
);

export const loadStats$ = new Subject().switchMap((cmd) => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(cmd.museumId);
  return simpleGet(`${baseUrl}/storagenodes/${cmd.nodeId}/stats`, cmd.token, cmd);
});

export const loadRootNode$ = new Subject().switchMap((cmd) => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(cmd.museumId);
  return simpleGet(`${baseUrl}/${cmd.nodeId}`, cmd.token, cmd);
});

export const deleteNode$ = new Subject().flatMap((cmd) => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(cmd.museumId);
  return simpleDel(`${baseUrl}/${cmd.nodeId}`, cmd.token, cmd);
});
