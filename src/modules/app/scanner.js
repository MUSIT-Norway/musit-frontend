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
import { loadNode$, loadChildren$, PER_PAGE } from '../movedialog/moveDialogStore';
import * as ajax from '../../shared/RxAjax';
import { I18n } from 'react-i18nify';

const UUID_REGEX = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const ROUTE_PICKLIST_PATH = pathToRegexp(ROUTE_PICKLIST);
const isNodePickList = (path = ROUTE_PICKLIST_PATH.exec(getLocationPath())) => path && path.length > 0 && path[1] === 'nodes';
const isObjectPickList = (path = ROUTE_PICKLIST_PATH.exec(getLocationPath())) => path && path.length > 0 && path[1] === 'objects';
const isStorageFacility = (pathname = getLocationPath()) => pathname.startsWith(ROUTE_SF);
const isMoveDialogActive = () => document.getElementsByClassName('moveDialog').length > 0;
const isMoveHistoryActive = () => document.getElementsByClassName('moveHistory').length > 0;

export const clearBuffer$ = createAction('clearBuffer$');
export const toggleEnabled$ = createAction('toggleEnabled$');
export const prepareSearch$ = createAction('prepareSearch$');
export const clearSearch$ = createAction('clearSearch$');
export const addMatches$ = createAction('addMatches$');
const bodyKeyPress = Observable.fromEvent(window.document.body, 'keypress');
const keyPress$ = (charStream: Observable) => charStream
  .filter(e => e.which !== 13 && e.which !== 10)
  .map(e => String.fromCharCode(e.which))
  .map(c => c.replace(/\+/g, '-'));
const scheduledClear$ = keyPress$(bodyKeyPress).debounce(() => Observable.timer(50));

export const actOnNode = (
  response,
  museumId,
  token,
  goTo,
  showError,
  clearSearch,
  clearBuffer,
  loadNode,
  loadChildren,
  addNode,
  moveDialog,
  nodePickList,
  storageFacility,
  moveHistory,
  moveDialogStore$ = Observable.of({ page: 1 })
) => {
  const error = () => {
    showError({ message: I18n.t('musit.errorMainMessages.scanner.cannotActOnNode')});
    clearSearch();
  };
  if (moveHistory()) {
    error();
  } else if (moveDialog()) {
    moveDialogStore$
      .map(state => state.page)
      .do(currentPage => {
        loadNode({id: response.id, museumId, token});
        loadChildren({id: response.id, museumId, token, page: {
          page: currentPage,
          limit: PER_PAGE
        }});
        clearBuffer();
      }).toPromise();
  } else if (nodePickList()) {
    addNode({value: response, path: getPath(response)});
    clearBuffer();
  } else if (storageFacility()) {
    goTo(`/magasin/${response.id}`);
    clearBuffer();
  } else {
    error();
  }
};

export const scanForNode = (
  ajaxGet = ajax.simpleGet,
  goTo =  hashHistory.push,
  showError = emitError,
  clearSearch = () => clearSearch$.next(),
  clearBuffer = () => clearBuffer$.next(),
  loadNode = (node) => loadNode$.next(node),
  loadChildren = (node) => loadChildren$.next(node),
  addNode = (node) => addNode$.next(node),
  moveDialog = isMoveDialogActive,
  nodePickList = isNodePickList,
  storageFacility = isStorageFacility,
  moveHistory = isMoveHistoryActive
) => ({ uuid, museumId, token }) => {
  MusitNode.findByUUID(ajaxGet)({uuid, museumId, token})
    .do(response => {
      if (response && response.nodeId) {
        actOnNode(
          response,
          museumId,
          token,
          goTo,
          showError,
          clearSearch,
          clearBuffer,
          loadNode,
          loadChildren,
          addNode,
          moveDialog,
          nodePickList,
          storageFacility,
          moveHistory
        );
      } else {
        showError({ message: I18n.t('musit.errorMainMessages.scanner.noMatchingNode', { uuid })});
        clearSearch();
      }
    }).toPromise();
};

export const actOnObject = (
  barcode,
  response,
  showError = emitError,
  addMatches = (matches) => addMatches$.next(matches),
  addObject = (object) => addObject$.next(object),
  clearSearch = () => clearSearch$.next(),
  clearBuffer = () => clearBuffer$.next(),
  goTo = hashHistory.push,
  objectPickList = isObjectPickList,
  storageFacility = isStorageFacility,
  moveDialog = isMoveDialogActive,
  moveHistory = isMoveHistoryActive
) => {
  if (response.length === 1 || !Array.isArray(response)) {
    const item = response.length ? response[0] : response;
    const error = () => {
      showError({ message: I18n.t('musit.errorMainMessages.scanner.cannotActOnObject')});
      clearSearch();
    };
    if (moveHistory() || moveDialog()) {
      error();
    } else if (objectPickList()) {
      addObject({ value: item, path: getPath(item)});
      clearBuffer();
    } else if (storageFacility()) {
      if (!item.currentLocationId) {
        showError({ message: I18n.t('musit.errorMainMessages.scanner.noCurrentLocation')});
        clearSearch();
      } else {
        goTo(`/magasin/${item.currentLocationId}/objects`);
        clearBuffer();
      }
    } else {
      error();
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
  addObject = (object) => addObject$.next(object),
  clearSearch = () => clearSearch$.next(),
  clearBuffer = () => clearBuffer$.next(),
  loadNode = (node) => loadNode$.next(node),
  loadChildren = (node) => loadChildren$.next(node),
  addNode = (node) => addNode$.next(node),
  moveDialog = isMoveDialogActive,
  nodePickList = isNodePickList,
  objectPickList = isObjectPickList,
  storageFacility = isStorageFacility,
  moveHistory = isMoveHistoryActive
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
        actOnObject(
          cmd.barcode,
          response,
          showError,
          addMatches,
          addObject,
          clearSearch,
          clearBuffer,
          goTo,
          objectPickList,
          storageFacility,
          moveDialog,
          moveHistory
        );
      } else if (response && response.nodeId) {
        actOnNode(
          response,
          cmd.museumId,
          cmd.token,
          goTo,
          showError,
          clearSearch,
          clearBuffer,
          loadNode,
          loadChildren,
          addNode,
          moveDialog,
          nodePickList,
          storageFacility,
          moveHistory
        );
      } else {
        showError({ message: I18n.t('musit.errorMainMessages.scanner.noMatchingNodeOrObject', { barcode: cmd.barcode })});
        clearSearch();
      }
    })
    .toPromise();

export const reducer$ = (actions, scanUUID) => Observable.merge(
  actions.clearBuffer$.map(() => (state) => ({...state, buffer: null, code: null, matches: null, searchComplete: false, searchPending: false})),
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
  keyPress$: keyPress$(bodyKeyPress),
  clearBuffer$,
  clearSearch$
};

export default (appSession$) => createStore(
  'scanner',
  reducer$({...commands, appSession$ },  scanForNode()),
  Observable.of({ enabled: false, buffer: null, code: null, matches: [] })
);