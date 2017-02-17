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
import { I18n } from 'react-i18nify';

const UUID_REGEX = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const ROUTE_PICKLIST_PATH = pathToRegexp(ROUTE_PICKLIST);
const isNodePickList = (path = ROUTE_PICKLIST_PATH.exec(getLocationPath())) => path && path.length > 0 && path[1] === 'nodes';
const isObjectPickList = (path = ROUTE_PICKLIST_PATH.exec(getLocationPath())) => path && path.length > 0 && path[1] === 'objects';
const isStorageFacility = (pathname = getLocationPath()) => pathname.startsWith(ROUTE_SF);
const isMoveDialogActive = () => document.getElementsByClassName('moveDialog').length > 0;

export const clearBuffer$ = createAction('clearBuffer$');
export const toggleEnabled$ = createAction('toggleEnabled$');
export const prepareSearch$ = createAction('prepareSearch$');
export const clearSearch$ = createAction('clearSearch$');
export const addMatches$ = createAction('addMatches$');
const keyPress$ = (charStream = Observable.fromEvent(window.document.body, 'keypress')) =>
  charStream
    .filter(e => e.which !== 13 && e.which !== 10)
    .map(e => String.fromCharCode(e.which))
    .map(c => c.replace(/\+/g, '-'));
const scheduledClear$ = keyPress$().debounce(() => Observable.timer(50));

export const actOnNode = (
  response,
  museumId,
  token,
  goTo = hashHistory.push,
  showError = emitError,
  moveDialog = isMoveDialogActive,
  nodePickList = isNodePickList,
  storageFacility = isStorageFacility
): Observable => {
  if (moveDialog()) {
    loadNode$.next({nodeId: response.id, museumId, token});
    loadChildren$.next({nodeId: response.id, museumId, token});
  } else if (nodePickList()) {
    addNode$.next({value: response, path: getPath(response)});
  } else if (storageFacility()) {
    goTo(`/magasin/${response.id}`);
  } else {
    showError({ message: I18n.t('musit.errorMainMessages.scanner.cannotActOnNode')});
  }
};

export const scanForNode = (
  ajaxGet = ajax.simpleGet,
  goTo =  hashHistory.push,
  showError = emitError,
  clearSearch = () => clearSearch$.next()
) => ({ uuid, museumId, token }) => {
  MusitNode.findByUUID(ajaxGet)({uuid, museumId, token})
    .toPromise()
    .then(response => {
      if (response && response.nodeId) {
        actOnNode(response, museumId, token, goTo, showError);
      } else {
        showError({ message: I18n.t('musit.errorMainMessages.scanner.noMatchingNode', { uuid })});
        clearSearch();
      }
    });
};

export const actOnObject = (
  barcode,
  response,
  showError = emitError,
  addMatches = (matches) => addMatches$.next(matches),
  clearSearch = () => clearSearch$.next(),
  goTo = hashHistory.push,
  objectPickList = isObjectPickList,
  storageFacility = isStorageFacility
) => {
  if (response.length === 1) {
    if (objectPickList()) {
      addObject$({ value: response[0], path: getPath(response[0])});
    } else if (storageFacility()) {
      goTo(`/magasin/${response[0].currentLocationId}/objects`);
    } else {
      showError({ message: I18n.t('musit.errorMainMessages.scanner.cannotActOnObject')});
    }
  } else if (response.length > 0) {
    addMatches(response);
  } else {
    showError({ message: I18n.t('musit.errorMainMessages.scanner.noMatchingNodeOrObject', { barcode })});
    clearSearch();
  }
};

export const scanForNodeOrObject = (
  ajaxGet = ajax.simpleGet,
  goTo = hashHistory.push,
  showError = emitError,
  addMatches = (matches) => addMatches$.next(matches),
  clearSearch = () => clearSearch$.next(),
  moveDialog = isMoveDialogActive,
  nodePickList = isNodePickList,
  objectPickList = isObjectPickList,
  storageFacility = isStorageFacility
) => (cmd): Observable =>
  MusitNode.findByBarcode(ajaxGet)(cmd)
    .flatMap((nodeResponse) => {
      if (!nodeResponse) {
        return MusitObject.findByBarcode(ajaxGet)(cmd);
      }
      return Observable.of(nodeResponse);
    })
    .do((response) => {
      if (Array.isArray(response)) {
        actOnObject(cmd.barcode, response, showError, addMatches, clearSearch, goTo, objectPickList, storageFacility);
      } else if (response && response.nodeId) {
        actOnNode(response, cmd.museumId, cmd.token, goTo, showError, moveDialog, nodePickList, storageFacility);
      } else {
        showError({ message: I18n.t('musit.errorMainMessages.scanner.noMatchingNodeOrObject', { barcode: cmd.barcode })});
        clearSearch();
      }
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
  keyPress$: keyPress$(),
  clearBuffer$,
  clearSearch$
};

export default (appSession$) => createStore(
  'scanner',
  reducer$({...commands, appSession$ },  scanForNode()),
  Observable.of({ enabled: false, buffer: null, code: null, matches: [] })
);