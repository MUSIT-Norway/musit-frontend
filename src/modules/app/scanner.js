import pathToRegexp from 'path-to-regexp';
import { Observable } from 'rxjs';
import { hashHistory } from 'react-router';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { getLocationPath, getPath } from '../../shared/util';
import { ROUTE_PICKLIST, ROUTE_SF } from '../../routes.path';
import MusitNode from '../../models/node';
import MusitObject from '../../models/object';
import { addNode$ } from '../app/pickList';
import { loadNode$, loadChildren$ } from '../movedialog/moveDialogStore';
import * as ajax from '../../shared/RxAjax';

const UUID_REGEX = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const ROUTE_PICKLIST_PATH = pathToRegexp(ROUTE_PICKLIST);
const isNodePickList = (path = ROUTE_PICKLIST_PATH.exec(getLocationPath())) => path && path.length > 0 && path[1] === 'nodes';
const isStorageFacility = (pathname = getLocationPath()) => pathname.startsWith(ROUTE_SF);
const isMoveDialogActive = () => document.getElementsByClassName('moveDialog').length > 0;

const scanForNode = (ajaxGet = ajax.simpleGet, push = hashHistory.push.bind(hashHistory)) => ({ uuid, museumId, token }) => {
  MusitNode.findByUUID(ajaxGet)({uuid, museumId, token})
    .toPromise()
    .then(response => {
      if (response && response.nodeId) {
        if (isMoveDialogActive()) {
          loadNode$.next({ nodeId: response.id, museumId, token });
          loadChildren$.next({ nodeId: response.id, museumId, token });
        } else if (isNodePickList()) {
          addNode$.next({ value: response, path: getPath(response)});
        } else if (isStorageFacility()) {
          push(`/magasin/${response.id}`);
        }
      }
    });
};

export const toggleEnabled$ = createAction('toggleEnabled$');
export const prepareSearch$ = createAction('prepareSearch$');
export const scanForOldBarCode$ = createAction('scanForOldBarCode$')
  .switchMap(cmd =>
    MusitNode.findByBarcode()(cmd)
      .flatMap((nodeResponse) => {
        if (!nodeResponse) {
          return MusitObject.findByBarcode()(cmd);
        }
        return Observable.of(nodeResponse);
      })
  );
const keyPress$ = Observable.fromEvent(window.document.body, 'keypress');
const scheduledClear$ = keyPress$.debounce(() => Observable.timer(200));

export const reducer$ = (actions, scanUUID) => Observable.merge(
  actions.prepareSearch$.map(() => (state) => ({...state, searchPending: true, searchComplete: false, matches: null})),
  actions.scanForOldBarCode$.map((matches) => (state) => ({...state, matches, searchPending: false, searchComplete: true})),
  actions.appSession$.map((appSession) => (state) => ({...state, appSession})),
  actions.scheduledClear$.map(() => (state) => {
    const code = /^[0-9]+$/.test(state.buffer) ? state.buffer : '';
    if (state.code !== state.buffer) {
      return {...state, buffer: null, code, matches: null};
    }
    return state;
  }),
  actions.toggleEnabled$.map(() => (state) => ({...state, enabled: !state.enabled })),
  actions.keyPress$.map((e) => (state) => {
    if (!state.enabled) {
      return state;
    }
    let buffer = `${state.buffer || ''}${String.fromCharCode(e.which).replace(/\+/g, '-')}`;
    if (UUID_REGEX.test(buffer)) {
      scanUUID({
        uuid: buffer,
        museumId: state.appSession.getMuseumId(),
        token: state.appSession.getAccessToken()
      });
      buffer = '';
    } else if (buffer.length > 36) {
      buffer = '';
    }
    return {...state, buffer };
  })
);

const commands = {
  scanForOldBarCode$,
  scheduledClear$,
  toggleEnabled$,
  prepareSearch$,
  keyPress$
};

export default (appSession$) => createStore(
  'scanner',
  reducer$({...commands, appSession$ },  scanForNode()),
  Observable.of({ enabled: false, buffer: null, code: null, matches: [] })
);