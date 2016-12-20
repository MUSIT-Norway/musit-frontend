const pathToRegexp = require('path-to-regexp');

import { Observable } from 'rxjs/Rx';

import { hashHistory } from 'react-router';

import { dispatchAction, getState } from '../reducers/public';
import { addNode, addObject } from '../reducers/picklist';
import { getPath } from '../reducers/helper';
import { getMuseumId, getCollectionId } from '../reducers/auth';
import { isMoveDialogActive, loadNode, loadChildren } from '../reducers/storageunit/modal';

import { ROUTE_PICKLIST, ROUTE_SF } from '../routes.path';

import Config from '../config';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OLD_REGEX = /^[0-9]{9,10}$/i;

const ROUTE_STATE = 'routing';
const ROUTE_LOCATION = 'locationBeforeTransitions';
const ROUTE_PICKLIST_PATH = pathToRegexp(ROUTE_PICKLIST);

const SCAN_START = 'musit/scan/start';
const SCAN_SUCCESS = 'musit/scan/success';
const SCAN_FAILURE = 'musit/scan/failure';

const keyPress$ = Observable.fromEvent(window, 'keypress');

const clear$ = keyPress$.debounce(() => Observable.timer(500));
const clearReducer$ = clear$.map(() => () => '');

const char$ = keyPress$.map(e => String.fromCharCode(e.which));
const charReducer$ = char$.map(text => (state) => `${state}${text.replace('\\+', '-')}`);

const state$ = Observable.merge(clearReducer$, charReducer$)
    .scan((state, reducer) => reducer(state), '')
    .map(text =>text.replace(/\+/g, '-'));

const getRoutePathname = () => getState(ROUTE_STATE, ROUTE_LOCATION).pathname;
const getPickListPath = (pathname) => ROUTE_PICKLIST_PATH.exec(pathname);
const isNodePickList = (path) => path && path.length > 0 && path[1] === 'node';
const isObjectPickList = (path) => path && path.length > 0 && path[1] === 'object';
const isStorageFacility = (pathname) => pathname.startsWith(ROUTE_SF);

const dispatchNode = (
  serviceUrl,
  nodePickList,
  storageFacility,
  moveActive
) => {
  dispatchAction({
    types: [SCAN_START, SCAN_SUCCESS, SCAN_FAILURE],
    promise: (client) => client.get(serviceUrl),
    callback: {
      onSuccess: (res) => {
        if (res.id) {
          if (moveActive) {
            dispatchAction(loadNode(res.id, getMuseumId()));
            dispatchAction(loadChildren(res.id, getMuseumId()));
          } else if (nodePickList) {
            dispatchAction(addNode(res, getPath(res)));
          } else if (storageFacility) {
            hashHistory.push(`/magasin/${res.id}`);
          }
        }
      }
    }
  });
};

const dispatchObject = (
  serviceUrl
) => {
  dispatchAction({
    types: [SCAN_START, SCAN_SUCCESS, SCAN_FAILURE],
    promise: (client) => client.get(serviceUrl),
    callback: {
      onSuccess: (res) => res.map(obj => dispatchAction(addObject(obj, getPath(obj))))
    }
  });
};

state$.filter(text => OLD_REGEX.test(text))
  .subscribe(oldBarcode => {
    const pathname = getRoutePathname();
    const pickListPath = getPickListPath(pathname);
    const nodePickList = isNodePickList(pickListPath);
    const objectPickList = isObjectPickList(pickListPath);
    const storageFacility = isStorageFacility();
    const moveActive = isMoveDialogActive();
    if (nodePickList || storageFacility || moveActive) {
      const url = Config.magasin.urls.storagefacility.scanOldUrl(oldBarcode, getMuseumId());
      dispatchNode(url, nodePickList, storageFacility, moveActive);
    } else if (objectPickList) {
      const url = Config.magasin.urls.thingaggregate.scanOldUrl(oldBarcode, getMuseumId(), getCollectionId());
      dispatchObject(url);
    }
  });

state$.filter(text => UUID_REGEX.test(text))
  .subscribe(uuid => {
    const pathname = getRoutePathname();
    const pickListPath = getPickListPath(pathname);
    const nodePickList = isNodePickList(pickListPath);
    const storageFacility = isStorageFacility();
    const moveActive = isMoveDialogActive();
    if (nodePickList || storageFacility || moveActive) {
      const url = Config.magasin.urls.storagefacility.scanUrl(uuid, getMuseumId());
      dispatchNode(url, nodePickList, storageFacility, moveActive);
    }
  });