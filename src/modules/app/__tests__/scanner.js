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
    const expected          = 'a------------';

    const expectedStateMap = {
      a: initialState
    };

    const keyPress$ = new Subject();
    const toggleEnabled$ = new Subject();
    const scanForUUID$ = new Subject();
    const scheduledClear$ = new Subject();

    const state$ = reducer$({ keyPress$, toggleEnabled$, scanForUUID$, scheduledClear$ });

    // assertion
    testScheduler.expectObservable(createStore('test', state$, Observable.of(initialState))).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});