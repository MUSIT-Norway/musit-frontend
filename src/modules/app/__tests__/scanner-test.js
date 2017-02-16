import { TestScheduler, Observable, Subject } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$ } from '../scanner';
import { createStore } from 'react-rxjs/dist/RxStore';
import MuseumId from '../../../models/museumId';
const diff = require('deep-diff').diff;

describe('scanner', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      console.log(JSON.stringify(actual, null, 2));
      console.log(JSON.stringify(expected, null, 2));
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    const initialState = { enabled: false, code: '', matches: [] };

    // mock streams
    const prepareSearchM     = '--1----------';
    const scheduledClearM    = '-------------';
    const scanForUUIDM       = '-------------';
    const toggleEnabledM     = '-------------';
    const clearBufferM       = '-----1-------';
    const keyPressM          = '-------------';
    const appSessionM        = '-1-----------';
    const expected           = 'abc--f-------';

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
        searchPending: true, searchComplete: false,
        appSession: {token: '1223', museumId: new MuseumId(99)}
      }
    };

    const clearSearch$ = new Subject();
    const addMatches$ = new Subject();
    const keyPress$ = testScheduler.createHotObservable(keyPressM);
    const clearBuffer$ = testScheduler.createHotObservable(clearBufferM);
    const toggleEnabled$ = testScheduler.createHotObservable(toggleEnabledM);
    const scanForUUID$ = testScheduler.createHotObservable(scanForUUIDM);
    const scheduledClear$ = testScheduler.createHotObservable(scheduledClearM);
    const prepareSearch$ = testScheduler.createHotObservable(prepareSearchM);
    const appSession$ = testScheduler.createHotObservable(appSessionM, { 1: { token: '1223', museumId: new MuseumId(99)}});

    const state$ = reducer$({
      keyPress$,
      toggleEnabled$,
      scanForUUID$,
      scheduledClear$,
      appSession$,
      prepareSearch$,
      clearBuffer$,
      clearSearch$,
      addMatches$
    });

    // assertion
    testScheduler.expectObservable(createStore('test', state$, Observable.of(initialState))).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});