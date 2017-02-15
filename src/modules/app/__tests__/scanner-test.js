import { TestScheduler, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$, scanForNodeOrObject } from '../scanner';
import { createStore } from 'react-rxjs/dist/RxStore';
import MuseumId from '../../../models/museumId';
import CollectionId from '../../../models/collectionId';
const diff = require('deep-diff').diff;

describe('scanner', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      // console.log(JSON.stringify(actual, null, 2));
      // console.log(JSON.stringify(expected, null, 2));
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    const initialState = { enabled: false, code: '', matches: [] };

    // mock streams
    const prepareSearchM     = '--1----------';
    const scanForOldBarCodeM = '---12--------';
    const scheduledClearM    = '-------------';
    const scanForUUIDM       = '-------------';
    const toggleEnabledM     = '-------------';
    const clearBufferM       = '-----1-------';
    const keyPressM          = '-------------';
    const appSessionM        = '-1-----------';
    const expected           = 'abcdef-------';

    const expectedStateMap = {
      a: initialState,
      b: {
        ...initialState,
        appSession: { token: '1223', museumId: new MuseumId(99)}
      },
      c: {
        ...initialState,
        appSession: { token: '1223', museumId: new MuseumId(99)},
        searchPending: true,
        searchComplete: false,
        matches: null
      },
      d: {
        ...initialState,
        appSession: { token: '1223', museumId: new MuseumId(99)},
        searchPending: false,
        searchComplete: true,
        matches: [
          {
            id: 456,
            currentLocation: 3,
            term: 'some term',
            museumNo: 'MUS45',
            subNo: '56'
          }
        ]
      },
      e: {
        ...initialState,
        appSession: { token: '1223', museumId: new MuseumId(99)},
        searchPending: false,
        searchComplete: true,
        matches: {
          id: 3,
          name: 'Test',
          type: 'Room',
          path: ',1,2,3,',
          pathNames: [
            {
              nodeId: 1,
              name: 'Museum'
            },
            {
              nodeId: 2,
              name: 'Building'
            },
            {
              nodeId: 3,
              name: 'Box'
            }
          ],
          breadcrumb: [
            {
              id: 1,
              name: 'Museum',
              url: '/magasin/1'
            },
            {
              id: 2,
              name: 'Building',
              url: '/magasin/2'
            },
            {
              id: 3,
              name: 'Box',
              url: '/magasin/3'
            }
          ]
        }
      },
      f: {
        ...initialState,
        buffer: null, code: null, matches: null,
        searchPending: false, searchComplete: false,
        appSession: {token: '1223', museumId: new MuseumId(99)}
      }
    };

    const keyPress$ = testScheduler.createHotObservable(keyPressM);
    const clearBuffer$ = testScheduler.createHotObservable(clearBufferM);
    const toggleEnabled$ = testScheduler.createHotObservable(toggleEnabledM);
    const scanForUUID$ = testScheduler.createHotObservable(scanForUUIDM);
    const scheduledClear$ = testScheduler.createHotObservable(scheduledClearM);
    const scanForOldBarCode$ = testScheduler.createHotObservable(scanForOldBarCodeM, {
      1: {
        barcode: 12334,
        museumId: new MuseumId(99),
        collectionId: new CollectionId('00000000-0000-0000-0000-000000000000'),
        token: '1234'
      },
      2: {
        barcode: 45678,
        museumId: new MuseumId(99),
        collectionId: new CollectionId('00000000-0000-0000-0000-000000000000'),
        token: '1234'
      }
    }).switchMap(scanForNodeOrObject((url) => {
      if (url.indexOf('scan?oldBarcode=12334&collectionIds=00000000-0000-0000-0000-000000000000') >  -1) {
        return Observable.of({
          response: [
            {
              id: 456,
              currentLocation: 3,
              term: 'some term',
              museumNo: 'MUS45',
              subNo: '56'
            }
          ]
        });
      }
      if (url.indexOf('scan?oldBarcode=45678&collectionIds=00000000-0000-0000-0000-000000000000') >  -1) {
        return Observable.of({});
      }
      if (url.indexOf('scan?oldBarcode=12334') > -1) {
        return Observable.of({});
      }
      if (url.indexOf('scan?oldBarcode=45678') > -1) {
        return Observable.of({
          response: {
            id: 3,
            name: 'Test',
            type: 'Room',
            path: ',1,2,3,',
            pathNames: [
              {
                nodeId: 1,
                name: 'Museum'
              },
              {
                nodeId: 2,
                name: 'Building'
              },
              {
                nodeId: 3,
                name: 'Box'
              }
            ]
          }
        });
      }
      throw new Error('Test error! Got url "' + url + '", but this url is not recognized in the test.');
    }));
    const prepareSearch$ = testScheduler.createHotObservable(prepareSearchM);
    const appSession$ = testScheduler.createHotObservable(appSessionM, { 1: { token: '1223', museumId: new MuseumId(99)}});

    const state$ = reducer$({
      keyPress$,
      toggleEnabled$,
      scanForUUID$,
      scheduledClear$,
      appSession$,
      scanForOldBarCode$,
      prepareSearch$,
      clearBuffer$
    });

    // assertion
    testScheduler.expectObservable(createStore('test', state$, Observable.of(initialState))).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});