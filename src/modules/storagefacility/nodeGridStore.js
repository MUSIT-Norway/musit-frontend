import { Observable } from 'rxjs';
import { createStore, createActions } from '../../state/RxStore';
import { get as ajaxGet } from '../../state/ajax';
import Config from '../../config';
import MuseumId from '../../shared/models/museumId';

export const {
  loadStorageObjects$,
  loadStorageUnits$,
  loadRoot$,
  loadChildren$,
  clear$
} = createActions('loadRoot$', 'loadStorageObjects$', 'loadStorageUnits$', 'loadChildren$', 'clear$');

export default createStore(Observable.empty().merge(
  clear$.map(() => () => ({ data: []})),
  loadRoot$.switchMap((cmd) =>
    ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(cmd.museumId)}/${cmd.nodeId}`, cmd.token)
      .map(({response}) => response)
  ).map((node) => (state) => ({...state, node})),
  loadChildren$.switchMap((cmd) => {
    let request;
    const mid = cmd.museumId.constructor.name === 'MuseumId' ? cmd.museumId : new MuseumId(cmd.museumId);
    if (cmd.nodeId) {
      const baseUrl = Config.magasin.urls.storagefacility.baseUrl(mid);
      request = ajaxGet(`${baseUrl}/${cmd.nodeId}/children?page=${cmd.page?cmd.page:1}&limit=${Config.magasin.limit}`, cmd.token);
    } else {
      request = ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(cmd.museumId)}/root`, cmd.token);
    }
    return request.map(({response}) => response);
  }).map((data) => (state) => ({...state, data: data}))
));
