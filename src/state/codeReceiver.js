import { Observable } from 'rxjs/Rx';

import { dispatchAction, getState } from '../reducers/public';
import { addNode } from '../reducers/picklist';
import { getPath } from '../reducers/helper';
import { getMuseumId } from '../reducers/auth';
import { hashHistory } from 'react-router';

import Config from '../config';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OLD_REGEX = /^[0-9]{9,10}$/i;

const ROUTE_STATE = 'routing';
const ROUTE_LOCATION = 'locationBeforeTransitions';
const ROUTE_PICKLIST_NODE = '/picklist/node';

const SCAN_START = 'musit/scan/start';
const SCAN_SUCCESS = 'musit/scan/success';
const SCAN_FAILURE = 'musit/scan/failure';

const clearScheduler$ = Observable.fromEvent(window, 'keypress').debounce(() => Observable.timer(500));
const clearReducer = clearScheduler$.map(() => () => '');

const keyPress$ = Observable.fromEvent(window, 'keypress').map(e => String.fromCharCode(e.which));
const keyPressReducer = keyPress$.map(text => (state) => `${state}${text.replace('\\+', '-')}`);

const state$ = Observable.merge(clearReducer, keyPressReducer)
    .scan((state, reducer) => reducer(state), '')
    .map(text => text.replace(/\+/g, '-'));

const callback = {
  onSuccess: (res) => {
    const isNodePickList = getState(ROUTE_STATE, ROUTE_LOCATION).pathname === ROUTE_PICKLIST_NODE;
    if (isNodePickList) {
      dispatchAction(addNode(res, getPath(res)));
    } else {
      hashHistory.push(`/magasin/${res.id}`);
    }
  }
};

state$.filter(text => OLD_REGEX.test(text))
    .subscribe(oldBarcode => {
      dispatchAction({
        types: [ SCAN_START, SCAN_SUCCESS, SCAN_FAILURE ],
        promise: (client) => client.get(Config.magasin.urls.storagefacility.scanOldUrl(oldBarcode, getMuseumId())),
        callback
      });
    });

state$.filter(text => UUID_REGEX.test(text))
    .subscribe(uuid => {
      dispatchAction({
        types: [ SCAN_START, SCAN_SUCCESS, SCAN_FAILURE ],
        promise: (client) => client.get(Config.magasin.urls.storagefacility.scanUrl(uuid, getMuseumId())),
        callback
      });
    });