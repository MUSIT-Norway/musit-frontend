import pathToRegexp from 'path-to-regexp';
import { Observable } from 'rxjs';
import { hashHistory } from 'react-router';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { getLocationPath, getPath } from '../../shared/util';
import { emitError } from '../../shared/errors';
import { ROUTE_PICKLIST, ROUTE_SF } from '../../routes.path';
import MusitNode from '../../models/node';
import MusitObject from '../../models/object';
import { addNode$, addObject$ } from '../app/pickList';
import { loadNode$, loadChildren$ } from '../movedialog/moveDialogStore';
import * as ajax from '../../shared/RxAjax';

const UUID_REGEX = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const ROUTE_PICKLIST_PATH = pathToRegexp(ROUTE_PICKLIST);
const isNodePickList = (path = ROUTE_PICKLIST_PATH.exec(getLocationPath())) => path && path.length > 0 && path[1] === 'nodes';
const isObjectPickList = (path = ROUTE_PICKLIST_PATH.exec(getLocationPath())) => path && path.length > 0 && path[1] === 'objects';
const isStorageFacility = (pathname = getLocationPath()) => pathname.startsWith(ROUTE_SF);
const isMoveDialogActive = () => document.getElementsByClassName('moveDialog').length > 0;

const push = hashHistory.push.bind(hashHistory);

export const clearBuffer$ = createAction('clearBuffer$');
export const toggleEnabled$ = createAction('toggleEnabled$');
export const prepareSearch$ = createAction('prepareSearch$');
export const clearSearch$ = createAction('clearSearch$');
export const addMatches$ = createAction('addMatches$');
const keyPress$ = Observable.fromEvent(window.document.body, 'keypress')
  .filter(e => e.which !== 13)
  .map(e => String.fromCharCode(e.which))
  .map(c => c.replace(/\+/g, '-'));
const scheduledClear$ = keyPress$.debounce(() => Observable.timer(50));

const actOnNode = (
  response,
  museumId,
  token,
  goTo,
  showError
): Observable => {
  if (isMoveDialogActive()) {
    loadNode$.next({nodeId: response.id, museumId, token});
    loadChildren$.next({nodeId: response.id, museumId, token});
  } else if (isNodePickList()) {
    addNode$.next({value: response, path: getPath(response)});
  } else if (isStorageFacility()) {
    goTo(`/magasin/${response.id}`);
  } else {
    showError({ message: 'Can only act on UUID scans from magasin, node picklist and move dialog'});
  }
};

export const scanForNode = (
  ajaxGet = ajax.simpleGet,
  goTo =  push,
  showError = emitError,
  clearSearch = () => clearSearch$.next()
) => ({ uuid, museumId, token }) => {
  MusitNode.findByUUID(ajaxGet)({uuid, museumId, token})
    .toPromise()
    .then(response => {
      if (response && response.nodeId) {
        actOnNode(response, museumId, token, goTo, showError);
      } else {
        showError({ message: 'Could not find any match for ' + uuid});
        clearSearch();
      }
    });
};

export const scanForNodeOrObject = (
  ajaxGet = ajax.simpleGet,
  goTo = push,
  showError = emitError,
  addMatches = (matches) => addMatches$.next(matches),
  clearSearch = () => clearSearch$.next()
) => (cmd): Observable =>
  MusitNode.findByBarcode(ajaxGet)(cmd)
    .flatMap((nodeResponse) => {
      if (!nodeResponse) {
        return MusitObject.findByBarcode(ajaxGet)(cmd);
      }
      return Observable.of(nodeResponse);
    })
    .flatMap((response) => {
      if (Array.isArray(response)) {
        if (response.length === 1) {
          if (isObjectPickList()) {
            addObject$({ value: response[0], path: getPath(response[0])});
          } else if (isStorageFacility()) {
            goTo(`/magasin/${response[0].currentLocationId}/objects`);
          } else {
            showError({ message: 'Can only act on old barcode scans for objects from magasin and object picklist'});
          }
        } else if (response.length > 0) {
          addMatches(response);
        } else {
          showError({ message: 'Could not find any match for ' + cmd.barcode});
          clearSearch();
        }
      } else if (response && response.nodeId) {
        actOnNode(response, cmd.museumId, cmd.token, goTo);
      } else {
        showError({ message: 'Could not find any match for ' + cmd.barcode});
        clearSearch();
      }
      return Observable.empty();
    })
    .toPromise();

export const reducer$ = (actions, scanUUID) => Observable.merge(
  actions.clearBuffer$.map(() => (state) => ({...state, buffer: null, code: null, matches: null, searchComplete: false})),
  actions.clearSearch$.map(() => (state) => ({...state, searchPending: false, searchComplete: false, matches: null})),
  actions.prepareSearch$.map(() => (state) => ({...state, searchPending: true, searchComplete: false, matches: null})),
  actions.addMatches$.map((matches) => (state) => ({...state, matches, searchPending: false, searchComplete: true})),
  actions.appSession$.map((appSession) => (state) => ({...state, appSession})),
  actions.scheduledClear$.map(() => (state) => {
    const code = /^[0-9]+$/.test(state.buffer) ? state.buffer : '';
    if (state.code !== state.buffer) {
      return {...state, buffer: null, code, matches: null};
    }
    return state;
  }),
  actions.toggleEnabled$.map(() => (state) => ({...state, enabled: !state.enabled })),
  actions.keyPress$.map((char) => (state) => {
    if (!state.enabled) {
      return state;
    }
    let buffer = `${state.buffer || ''}${char}`;
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
  addMatches$,
  scheduledClear$,
  toggleEnabled$,
  prepareSearch$,
  keyPress$,
  clearBuffer$,
  clearSearch$
};

export default (appSession$) => createStore(
  'scanner',
  reducer$({...commands, appSession$ },  scanForNode()),
  Observable.of({ enabled: false, buffer: null, code: null, matches: [] })
);