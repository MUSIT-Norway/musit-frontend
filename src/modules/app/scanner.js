import pathToRegexp from 'path-to-regexp';
import { Observable } from 'rxjs';
import { hashHistory } from 'react-router';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { getLocationPath, getPath } from '../../shared/util';
import { ROUTE_PICKLIST, ROUTE_SF } from '../../routes.path';
import MusitNode from '../../models/node';
import { addNode$ } from '../app/pickList';
import { loadNode$, loadChildren$ } from '../movedialog/moveDialogStore';
import * as ajax from '../../shared/RxAjax';

const UUID_REGEX = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const ROUTE_PICKLIST_PATH = pathToRegexp(ROUTE_PICKLIST);
const isNodePickList = (path = ROUTE_PICKLIST_PATH.exec(getLocationPath())) => path && path.length > 0 && path[1] === 'nodes';
const isStorageFacility = (pathname = getLocationPath()) => pathname.startsWith(ROUTE_SF);
const isMoveDialogActive = () => document.getElementsByClassName('moveDialog').length > 0;

const noOp = () => false;

const scanForNode = ({ simpleGet }, { push }) => (buffer, museumId, token) => {
  MusitNode.findByUUID(simpleGet)(buffer, museumId, token)
    .toPromise()
    .then(({ response }) => {
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
    }).catch(noOp);
};

export const toggleEnabled$ = createAction('toggleEnabled$');
const keyPress$ = Observable.fromEvent(window.document.body, 'keypress');
const scheduledClear$ = keyPress$.debounce(() => Observable.timer(300));

export const reducer$ = (actions, scanUUID) => Observable.merge(
  actions.appSession$.map((appSession) => (state) => ({...state, appSession})),
  actions.scheduledClear$.map(() => (state) => {
    const code = /^[0-9]+$/.test(state.buffer) ? state.buffer : '';
    return {...state, buffer: null, code};
  }),
  actions.toggleEnabled$.map(() => (state) => ({...state, enabled: !state.enabled })),
  actions.keyPress$.map((e) => (state) => {
    if (!state.enabled) {
      return state;
    }
    let buffer = `${state.buffer || ''}${String.fromCharCode(e.which).replace(/\+/g, '-')}`;
    if (UUID_REGEX.test(buffer)) {
      scanUUID(ajax, hashHistory)(
        buffer,
        state.appSession.getMuseumId(),
        state.appSession.getAccessToken()
      );
      buffer = '';
    } else if (buffer.length > 36) {
      buffer = '';
    }
    return {...state, buffer };
  })
);

const commands = {
  scheduledClear$,
  toggleEnabled$,
  keyPress$
};

export default (appSession$) => createStore(
  'scanner',
  reducer$({...commands, appSession$ },  scanForNode),
  Observable.of({ enabled: false, buffer: null, code: null, matches: [] })
);