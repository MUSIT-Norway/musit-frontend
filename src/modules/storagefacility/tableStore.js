import { Observable, Subject } from 'rxjs';
import { createStore } from '../../state/RxStore';
import { get as ajaxGet } from '../../state/ajax';
import Config from '../../config';
import MusitObject from '../../shared/models/object';
import { getPath } from '../../shared/util';

export const init$ = new Subject();

export const loadChildren$ = new Subject().switchMap((cmd) => {
  let request;
  if (cmd.nodeId) {
    const baseUrl = Config.magasin.urls.storagefacility.baseUrl(cmd.museumId);
    request = ajaxGet(`${baseUrl}/${cmd.nodeId}/children?page=${cmd.page?cmd.page:1}&limit=${Config.magasin.limit}`, cmd.token);
  } else {
    request = ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(cmd.museumId)}/root`, cmd.token);
  }
  return request
    .map(({response}) => response)
    .do(response => cmd.onComplete && cmd.onComplete(response));
});

export const loadObjects$ = new Subject().switchMap((cmd) => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(cmd.museumId);
  const url = `${baseUrl}/node/${cmd.nodeId}/objects?${cmd.collectionId.getQuery()}&page=${cmd.page || 1}&limit=${Config.magasin.limit}`;
  return ajaxGet(url, cmd.token)
    .map(({response}) => response)
    .do(response => cmd.onComplete && cmd.onComplete(response));
});

export const loadStats$ = new Subject().switchMap((cmd) =>
  ajaxGet(`${Config.magasin.urls.thingaggregate.baseUrl(cmd.museumId)}/storagenodes/${cmd.nodeId}/stats`, cmd.token)
    .map(({response}) => response)
    .do(response => cmd.onComplete && cmd.onComplete(response))
);

export const loadNode$ = new Subject().switchMap((cmd) =>
  ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(cmd.museumId)}/${cmd.nodeId}`, cmd.token)
    .map(({response}) => response)
    .do(response => cmd.onComplete && cmd.onComplete(response))
);

const reducer$ = Observable.empty().merge(
  init$.map(() => () => ({
    rootNode: null,
    nodes: { loading: true, data: null },
    objects: { loading: true, data: null },
    stats: null
  })),
  loadStats$.map((stats) => (state) => ({
    ...state,
    stats
  })),
  loadNode$.map((rootNode) => (state) => ({
    ...state,
    rootNode: {
      ...rootNode,
      breadcrumb: getPath(rootNode)
    }
  })),
  loadChildren$.map((data) => (state) => ({
    ...state,
    nodes: { data, loading: false }
  })),
  loadObjects$.map((data) => (state) => ({
    ...state,
    objects: {
      data: {
        ...data,
        matches: data.matches.map(o => new MusitObject(o))
      },
      loading: false
    }
  }))
);

export default createStore(reducer$);
