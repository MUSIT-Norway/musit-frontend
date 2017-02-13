import { TestScheduler, Subject, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$ } from '../scanner';
import { createStore } from 'react-rxjs/dist/RxStore';

describe('scanner', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      // console.log(JSON.stringify(actual, null, 2));
      // console.log(JSON.stringify(expected, null, 2));
      return assert.deepEqual(actual, expected);
    });

    const initialState = { enabled: false, code: '', matches: [] };

    // mock streams
    const appSessionM       = '-1----------';
    const expected          = 'ab-----------';

    const expectedStateMap = {
      a: initialState,
      b: {...initialState, appSession: { token: '1223 '}}
    };

    const keyPress$ = new Subject();
    const toggleEnabled$ = new Subject();
    const scanForUUID$ = new Subject();
    const scheduledClear$ = new Subject();
    const scanForOldBarCode$ = new Subject();
    const appSession$ = testScheduler.createHotObservable(appSessionM, { 1: { token: '1223 '}});

    const state$ = reducer$({ keyPress$, toggleEnabled$, scanForUUID$, scheduledClear$, appSession$, scanForOldBarCode$ });

    // assertion
    testScheduler.expectObservable(createStore('test', state$, Observable.of(initialState))).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});