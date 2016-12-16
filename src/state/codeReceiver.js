const pathToRegexp = require('path-to-regexp');

import { Observable } from 'rxjs/Rx';

import { hashHistory } from 'react-router';

import { dispatchAction, getState } from '../reducers/public';
import { addNode, addObject } from '../reducers/picklist';
import { getPath } from '../reducers/helper';
import { getMuseumId, getCollectionId } from '../reducers/auth';
import { ROUTE_PICKLIST, ROUTE_STORAGEFACILITY } from '../routes';

import Config from '../config';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OLD_REGEX = /^[0-9]{9,10}$/i;

const ROUTE_STATE = 'routing';
const ROUTE_LOCATION = 'locationBeforeTransitions';
const ROUTE_PICKLIST_KEYS = [];
const ROUTE_PICKLIST_PATH = pathToRegexp(ROUTE_PICKLIST, ROUTE_PICKLIST_KEYS);

const SCAN_START = 'musit/scan/start';
const SCAN_SUCCESS = 'musit/scan/success';
const SCAN_FAILURE = 'musit/scan/failure';

const keyPress$ = Observable.fromEvent(window, 'keypress');

const clear$ = keyPress$.debounce(() => Observable.timer(500));
const clearReducer$ = clear$.map(() => () => '');

const char$ = keyPress$.debounce(() => Observable.timer(50)).map(e => String.fromCharCode(e.which));
const charReducer$ = char$.map(text => (state) => `${state}${text.replace('\\+', '-')}`);

const state$ = Observable.merge(clearReducer$, charReducer$)
    .scan((state, reducer) => reducer(state), '')
    .map(text => text.replace(/\+/g, '-'));

const callbackNode = {
  onSuccess: (res) => {
    const path = ROUTE_PICKLIST_PATH.exec(getState(ROUTE_STATE, ROUTE_LOCATION).pathname);
    const isNodePickList = path[1] === 'node';
    if (isNodePickList) {
      dispatchAction(addNode(res, getPath(res)));
    } else {
      hashHistory.push(`/magasin/${res.id}`);
    }
  }
};

const callbackObject = {
  onSuccess: (res) => {
    const path = ROUTE_PICKLIST_PATH.exec(getState(ROUTE_STATE, ROUTE_LOCATION).pathname);
    const isNodePickList = path[1] === 'object';
    if (isNodePickList) {
      res.map(obj => dispatchAction(addObject(obj, getPath(obj))));
    }
  }
};

state$.filter(text => OLD_REGEX.test(text))
    .subscribe(oldBarcode => {
      const pathname = getState(ROUTE_STATE, ROUTE_LOCATION).pathname;
      const picklistMatch = ROUTE_PICKLIST_PATH.exec(pathname);
      const isNodePickList = picklistMatch && picklistMatch.length > 0 && picklistMatch[1] === 'node';
      const isObjectPickList = picklistMatch && picklistMatch.length > 0 && picklistMatch[1] === 'object';
      const isStoragefacility = pathname.startsWith(ROUTE_STORAGEFACILITY);

      if (isNodePickList || isStoragefacility) {
        dispatchAction({
          types: [ SCAN_START, SCAN_SUCCESS, SCAN_FAILURE ],
          promise: (client) => client.get(Config.magasin.urls.storagefacility.scanOldUrl(oldBarcode, getMuseumId())),
          callback: callbackNode
        });
      } else if (isObjectPickList) {
        dispatchAction({
          types: [ SCAN_START, SCAN_SUCCESS, SCAN_FAILURE ],
          promise: (client) => client.get(Config.magasin.urls.thingaggregate.scanOldUrl(oldBarcode, getMuseumId(), getCollectionId())),
          callback: callbackObject
        });
      }
    });

state$.filter(text => UUID_REGEX.test(text))
    .subscribe(uuid => {
      dispatchAction({
        types: [ SCAN_START, SCAN_SUCCESS, SCAN_FAILURE ],
        promise: (client) => client.get(Config.magasin.urls.storagefacility.scanUrl(uuid, getMuseumId())),
        callback: callbackNode
      });
    });