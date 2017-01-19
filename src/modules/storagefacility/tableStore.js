import { Observable, Subject } from 'rxjs';
import { createStore } from '../../state/RxStore';
import { get as ajaxGet, del as ajaxDelete } from '../../state/ajax';
import Config from '../../config';
import MusitObject from '../../shared/models/object';
import { getPath } from '../../shared/util';

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

export const init$ = new Subject();

export const loadChildren$ = new Subject().switchMap((cmd) => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(cmd.museumId);
  let request;
  if (cmd.nodeId) {
    request = ajaxGet(`${baseUrl}/${cmd.nodeId}/children?page=${cmd.page?cmd.page:1}&limit=${Config.magasin.limit}`, cmd.token);
  } else {
    request = ajaxGet(`${baseUrl}/root`, cmd.token);
  }
  return request
    .map(toResponse)
    .do(onComplete(cmd))
    .catch(onFailure(cmd));
});

export const loadObjects$ = new Subject().switchMap((cmd) => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(cmd.museumId);
  const url = `${baseUrl}/node/${cmd.nodeId}/objects?${cmd.collectionId.getQuery()}&page=${cmd.page || 1}&limit=${Config.magasin.limit}`;
  return ajaxGet(url, cmd.token)
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

export const loadNode$ = new Subject().switchMap((cmd) => {
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

const reducer$ = Observable.empty().merge(
  init$.map(() => () => ({
    rootNode: null,
    nodes: { loading: true, data: null },
    objects: { loading: true, data: null },
    stats: null
  })),
  deleteNode$.map(() => (state) => state),
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
