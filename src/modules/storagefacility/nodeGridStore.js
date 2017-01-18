import { Observable } from 'rxjs';
import { createStore, createActions } from '../../state/RxStore';
import { get as ajaxGet } from '../../state/ajax';
import Config from '../../config';
import MuseumId from '../../shared/models/museumId';
import { getPath } from '../../shared/util';

export const {
  loadChildren$,
  loadStats$,
  loadNode$,
  init$
} = createActions('loadChildren$', 'loadStats$', 'loadNode$', 'init$');

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

const loadStats = (cmd) =>
  ajaxGet(`${Config.magasin.urls.thingaggregate.baseUrl(cmd.museumId)}/storagenodes/${cmd.nodeId}/stats`, cmd.token)
    .map(({response}) => response);

const loadNode = (cmd) =>
  ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(cmd.museumId)}/${cmd.nodeId}`, cmd.token)
    .map(({response}) => ({...response, breadcrumb: getPath(response)}));

const reducer = Observable.empty().merge(
  init$.map(() => () => ({loading: true, node: null, data: null, stats: null})),
  loadStats$.switchMap(loadStats).map((stats) => (state) => ({...state, stats})),
  loadNode$.switchMap(loadNode).map((node) => (state) => ({...state, node})),
  loadChildren$.switchMap(loadChildren).map((data) => (state) => ({...state, data, loading: false}))
);

export default createStore(reducer);
