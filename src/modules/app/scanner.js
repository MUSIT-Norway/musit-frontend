import pathToRegexp from 'path-to-regexp';
import { Observable } from 'rxjs';
import { hashHistory } from 'react-router';
import { emitError } from '../../shared/errors';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { getLocationPath, isNumber, getPath } from '../../shared/util';
import { ROUTE_PICKLIST, ROUTE_SF } from '../../routes.path';
import MusitObject from '../../models/object';
import MusitNode from '../../models/node';
import { addNode$ } from '../app/pickList';
import { loadNode$, loadChildren$ } from '../movedialog/moveDialogStore';

const UUID_REGEX = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const ROUTE_PICKLIST_PATH = pathToRegexp(ROUTE_PICKLIST);
const isNodePickList = (path = ROUTE_PICKLIST_PATH.exec(getLocationPath())) => path && path.length > 0 && path[1] === 'nodes';
const isStorageFacility = (pathname = getLocationPath()) => pathname.startsWith(ROUTE_SF);
const isMoveDialogActive = () => document.getElementsByClassName('moveDialog').length > 0;

const scanForUUID = (buffer, museumId, collectionId, token) => {
  MusitNode.findByUUID(buffer, museumId, token)
    .toPromise()
    .then(({ response }) => {
      if (response && response.nodeId) {
        if (isMoveDialogActive()) {
          loadNode$.next({ nodeId: response.id, museumId, token });
          loadChildren$.next({ nodeId: response.id, museumId, token });
        } else if (isNodePickList()) {
          addNode$.next({ value: response, path: getPath(response)});
        } else if (isStorageFacility()) {
          hashHistory.push(`/magasin/${response.id}`);
        }
      } else if (isNumber(buffer)) {
        MusitObject.findByBarcode(buffer, museumId, collectionId, token).toPromise()
          .then(maybeObj => {
            if (maybeObj.length && maybeObj.length > 0) {
              hashHistory.push(`/magasin/${maybeObj[0].currentLocationId}/objects`);
            } else {
              throw new Error('Fant ingen node eller object for ' + buffer);
            }
          });
      } else {
        throw new Error('Fant ingen node for ' + buffer);
      }
    })
    .catch((error) => {
      if (error.response) {
        emitError({
          type: 'network',
          error: {
            ...error, response: {
              ...error.response,
              body: null
            }
          }
        });
      } else {
        emitError({
          message: error
        });
      }
    });
};

export const toggleEnabled$ = createAction('toggleEnabled$');
const keyPress$ = Observable.fromEvent(window.document.body, 'keypress');
const scheduledClear$ = keyPress$.debounce(() => Observable.timer(500));

export const reducer$ = (actions) => Observable.merge(
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
    let buffer = `${state.buffer || ''}${String.fromCharCode(e.which).replace('\\+', '-')}`;
    if (UUID_REGEX.test(buffer)) {
      scanForUUID(buffer);
      buffer = '';
    } else if (buffer.length > 32) {
      buffer = '';
    }
    return {...state, buffer };
  })
);

export default (appSession$) => createStore('scanner', reducer$({
  appSession$,
  scheduledClear$,
  toggleEnabled$,
  keyPress$
}), Observable.of({ enabled: false, buffer: null, code: null, matches: [] }));