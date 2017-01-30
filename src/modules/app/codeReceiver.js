import pathToRegexp from 'path-to-regexp';
import { Observable } from 'rxjs/Rx';
import { hashHistory } from 'react-router';
import { addNode$, addObject$ } from '../app/pickList';
import { isMoveDialogActive, loadNode, loadChildren } from '../storagefacility/reducers/modal';
import { ROUTE_PICKLIST, ROUTE_SF } from '../../routes.path';
import { emitError } from '../../shared/errors';
import { isNumber, getPath, dispatchAction } from '../../shared/util';
import Config from '../../config';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OLD_REGEX = /^[0-9]{9,11}$/i;
const ROUTE_PICKLIST_PATH = pathToRegexp(ROUTE_PICKLIST);
const SCAN_START = 'musit/scan/start';
const SCAN_SUCCESS = 'musit/scan/success';
const SCAN_FAILURE = 'musit/scan/failure';
const getPickListPath = (pathname) => ROUTE_PICKLIST_PATH.exec(pathname);
const isNodePickList = (path) => path && path.length > 0 && path[1] === 'nodes';
const isObjectPickList = (path) => path && path.length > 0 && path[1] === 'objects';
const isStorageFacility = (pathname) => pathname.startsWith(ROUTE_SF);
const scanOldBarcodeObjectUrlFn = Config.magasin.urls.thingaggregate.scanOldUrl;
const scanOldBarcodeNodeUrlFn = Config.magasin.urls.storagefacility.scanOldUrl;
const scanUUIDNodeUrlFn = Config.magasin.urls.storagefacility.scanUrl;
const getRoutePathname = () => {
  const hash = window.location.hash;
  if (hash.indexOf('#') === -1) {
    return hash;
  }
  if (hash.indexOf('?') === -1) {
    return hash.substr(1);
  }
  return hash.substr(1, hash.indexOf('?') - 1);
};

export default function (appSession$) {
  let appSession;
  appSession$.subscribe(state => appSession = state);
  const keyPress$ = Observable.fromEvent(window, 'keypress');

  const clear$ = keyPress$.debounce(() => Observable.timer(500));
  const clearReducer$ = clear$.map(() => () => '');

  const char$ = keyPress$.map(e => String.fromCharCode(e.which));
  const charReducer$ = char$.map(text => (state) => `${state}${text.replace('\\+', '-')}`);

  const state$ = Observable.merge(clearReducer$, charReducer$)
    .scan((state, reducer) => reducer(state), '')
    .map(text => text.replace(/\+/g, '-'));

  const dispatchNodeSearch = (scanNodeUrlFn,
                              scanObjectUrlFn,
                              uuidOrBarCode,
                              nodePickList,
                              storageFacility,
                              moveActive,
                              museumId = appSession.getMuseumId(),
                              collectionId = appSession.getCollectionId()) => {
    dispatchAction({
      types: [SCAN_START, SCAN_SUCCESS, SCAN_FAILURE],
      promise: (client) => new Promise((resolve, reject) => {
        client.get(scanNodeUrlFn(uuidOrBarCode, museumId))
          .then(maybeNode => {
            if (maybeNode.nodeId) {
              resolve(maybeNode);
            } else if (isNumber(uuidOrBarCode)) {
              client.get(scanObjectUrlFn(uuidOrBarCode, museumId, collectionId))
                .then(maybeObj => {
                  console.log('Object:');
                  console.log(maybeObj);
                  if (maybeObj.length && maybeObj.length > 0) {
                    resolve(maybeObj[0]);
                  } else {
                    reject('Fant ingen node eller object for ' + uuidOrBarCode);
                  }
                }).catch(error => reject(error));
            } else {
              reject('Fant ingen node for ' + uuidOrBarCode);
            }
          }).catch(error => reject(error));
      }),
      callback: {
        onSuccess: (res) => {
          if (res.nodeId) {
            if (moveActive) {
              dispatchAction(loadNode(res.id, museumId));
              dispatchAction(loadChildren(res.id, museumId));
            } else if (nodePickList) {
              dispatchAction(addNode$.next({ value: res, path: getPath(res)}));
            } else if (storageFacility) {
              hashHistory.push(`/magasin/${res.id}`);
            }
          } else if (res.currentLocationId) {
            console.log(res.currentLocationId);
            hashHistory.push(`/magasin/${res.currentLocationId}/objects`);
          }
        },
        onFailure: (error) => {
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
        }
      }
    });
  };

  const dispatchObject = (urlFn,
                          oldBarcode,
                          museumId = appSession.getMuseumId(),
                          collectionId = appSession.getCollectionId()) => {
    console.log('122');
    dispatchAction({
      types: [SCAN_START, SCAN_SUCCESS, SCAN_FAILURE],
      promise: (client) => client.get(urlFn(oldBarcode, museumId, collectionId)),
      callback: {
        onSuccess: (res) => res.map(obj => dispatchAction(addObject$.next(({ value: obj, path: getPath(obj)}))))
      }
    });
  };

  state$.filter(text => OLD_REGEX.test(text))
    .subscribe(oldBarcode => {
      const pathname = getRoutePathname();
      const pickListPath = getPickListPath(pathname);
      const nodePickList = isNodePickList(pickListPath);
      const objectPickList = isObjectPickList(pickListPath);
      const storageFacility = isStorageFacility(pathname);
      const moveActive = isMoveDialogActive();
      if (nodePickList || moveActive || storageFacility) {
        dispatchNodeSearch(
          scanOldBarcodeNodeUrlFn,
          scanOldBarcodeObjectUrlFn,
          oldBarcode,
          nodePickList,
          storageFacility,
          moveActive
        );
      } else if (objectPickList) {
        dispatchObject(
          scanOldBarcodeObjectUrlFn,
          oldBarcode
        );
      } else {
        emitError({message: 'Scanning av gamle barcodes kan kun gjøres i magasin eller node/objekt plukkliste'});
      }
    });

  state$.filter(text => UUID_REGEX.test(text))
    .subscribe(uuid => {
      const pathname = getRoutePathname();
      const pickListPath = getPickListPath(pathname);
      const nodePickList = isNodePickList(pickListPath);
      const storageFacility = isStorageFacility(pathname);
      const moveActive = isMoveDialogActive();
      if (nodePickList || moveActive || storageFacility) {
        dispatchNodeSearch(
          scanUUIDNodeUrlFn,
          scanOldBarcodeObjectUrlFn,
          uuid,
          nodePickList,
          storageFacility,
          moveActive
        );
      } else {
        emitError({message: 'Scanning av uuid kan kun gjøres i magasin eller node plukkliste'});
      }
    });
}