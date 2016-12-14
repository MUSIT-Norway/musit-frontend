import {Observable} from 'rxjs/Rx';
import { dispatchAction, getState } from '../reducers/public';
import { addNode } from '../reducers/picklist';
import { getPath } from '../reducers/helper';
import { getMuseumId } from '../reducers/auth';
import { hashHistory } from 'react-router';
import Config from '../config';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const clearScheduler$ = Observable.fromEvent(window, 'keypress').debounce(() => Observable.timer(500));
const clearReducer = clearScheduler$.map(() => () => '');

const keyPress$ = Observable.fromEvent(window, 'keypress').map(e => String.fromCharCode(e.which));
const keyPressReducer = keyPress$.map(text => (state) => `${state}${text.replace('\\+', '-')}`);

Observable.merge(clearReducer, keyPressReducer).scan((state, changeFn) => changeFn(state), '')
    .map(text => text.replace(/\+/g, '-'))
    .filter(text => text.length === 36)
    .subscribe(uuid => {
      if (UUID_REGEX.test(uuid)) {
        dispatchAction({
          promise: (client) => client.get(Config.magasin.urls.storagefacility.scanUrl(uuid, getMuseumId())),
          callback: {
            onSuccess: (res) => {
              const isNodePickList = getState('routing', 'locationBeforeTransitions').pathname === '/picklist/node';
              if (isNodePickList) {
                dispatchAction(addNode(res, getPath(res)));
              } else {
                hashHistory.push(`/magasin/${res.id}`);
              }
            }
          }
        });
      }
    });