import { Observable } from 'rxjs';
import { createStore, createActions } from '../../state/RxStore';
import { get as ajaxGet } from '../../state/ajax';
import Config from '../../config';
import MuseumId from '../../shared/models/museumId';
import MusitObject from '../../shared/models/object';
import { getPath } from '../../shared/util';

export const {
  loadChildren$,
  loadObjects$,
  loadStats$,
  loadNode$,
  init$
} = createActions('loadChildren$', 'loadObjects$', 'loadStats$', 'loadNode$', 'init$');

const loadChildren = (cmd) => {
  let request;
  const mid = cmd.museumId.id ? cmd.museumId : new MuseumId(cmd.museumId);
  if (cmd.nodeId) {
    const baseUrl = Config.magasin.urls.storagefacility.baseUrl(mid);
    request = ajaxGet(`${baseUrl}/${cmd.nodeId}/children?page=${cmd.page?cmd.page:1}&limit=${Config.magasin.limit}`, cmd.token);
  } else {
    request = ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(cmd.museumId)}/root`, cmd.token);
  }
  return request.map(({response}) => response);
};

const loadObjects = (cmd) => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(cmd.museumId);
  const url = `${baseUrl}/node/${cmd.nodeId}/objects?${cmd.collectionId.getQuery()}&page=${cmd.page || 1}&limit=${Config.magasin.limit}`;
  return ajaxGet(url, cmd.token).map(({response}) => response);
};

const loadStats = (cmd) =>
  ajaxGet(`${Config.magasin.urls.thingaggregate.baseUrl(cmd.museumId)}/storagenodes/${cmd.nodeId}/stats`, cmd.token)
    .map(({response}) => response);

const loadNode = (cmd) =>
  ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(cmd.museumId)}/${cmd.nodeId}`, cmd.token)
    .map(({response}) => response);

const reducer = Observable.empty().merge(
  init$.map(() => () => ({
    rootNode: null,
    nodes: { loading: true, data: null },
    objects: { loading: true, data: null },
    stats: null
  })),
  loadStats$.switchMap(loadStats).map((stats) => (state) => ({
    ...state,
    stats
  })),
  loadNode$.switchMap(loadNode).map((rootNode) => (state) => ({
    ...state,
    rootNode: {
      ...rootNode,
      breadcrumb: getPath(rootNode)
    }
  })),
  loadChildren$.switchMap(loadChildren).map((data) => (state) => ({
    ...state,
    nodes: { data, loading: false }
  })),
  loadObjects$.switchMap(loadObjects).map((data) => (state) => ({
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

export default createStore(reducer);
