import { TestScheduler, Subject, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { store$, loadEvents } from '../eventsStore';
import MusitNode from '../../../models/node';
const diff = require('deep-diff').diff;

describe('controlsAndObservationsStore', () => {
  it('testing reducer with actors', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    // mock streams
    const clearEventsM = '-1--------------';
    const loadEventsM = '--1-------------';
    const expected = 'abc-------------';

    const expectedStateMap = {
      a: {
        data: []
      },
      b: {
        data: [],
        loading: true
      },
      c: {
        data: [
          { id: 23444, doneBy: 'Test 2', registeredBy: 'Test 3' },
          { id: 1455, doneBy: 'Test 1', registeredBy: 'Test 4' }
        ],
        loading: false
      }
    };

    const clearEvents$ = testScheduler.createHotObservable(clearEventsM);
    const loadRootNode$ = new Subject();
    const loadEvents$ = testScheduler
      .createHotObservable(loadEventsM, {
        1: { nodeId: 1, museumId: 1, token: '1234' }
      })
      .switchMap(
        loadEvents({
          simpleGet: url => {
            if (url.indexOf('controls') > -1) {
              return Observable.of({
                response: [
                  {
                    id: 1455,
                    doneBy: 'eaf19dfb-ec28-4fbd-8602-e4be062e592c',
                    registeredBy: '97ce5637-6e6d-418e-bc45-a2637c9945f3'
                  }
                ]
              });
            } else if (url.indexOf('observations') > -1) {
              return Observable.of({
                response: [
                  {
                    id: 23444,
                    doneBy: 'eaf19dfb-ec28-4fbd-8602-e4be062e592b',
                    registeredBy: '97ce5637-6e6d-418e-bc45-a2637c9945f2'
                  }
                ]
              });
            }
          },
          simplePost: () =>
            Observable.of({
              response: [
                {
                  fn: 'Test 1',
                  dataportenId: 'eaf19dfb-ec28-4fbd-8602-e4be062e592c'
                },
                {
                  fn: 'Test 2',
                  dataportenId: 'eaf19dfb-ec28-4fbd-8602-e4be062e592b'
                },
                {
                  fn: 'Test 3',
                  dataportenId: '97ce5637-6e6d-418e-bc45-a2637c9945f2'
                },
                {
                  fn: 'Test 4',
                  dataportenId: '97ce5637-6e6d-418e-bc45-a2637c9945f3'
                }
              ]
            })
        })
      );

    const state$ = store$({ clearEvents$, loadRootNode$, loadEvents$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });

  it('testing reducer with no actor hits', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    // mock streams
    const loadRootNodeM = '---1------------';
    const clearEventsM = '-1--------------';
    const loadEventsM = '--1-------------';
    const expected = 'abcd------------';

    const expectedStateMap = {
      a: {
        data: []
      },
      b: {
        data: [],
        loading: true
      },
      c: {
        data: [
          { id: 23444, doneBy: undefined, registeredBy: undefined },
          { id: 1455, doneBy: undefined, registeredBy: undefined }
        ],
        loading: false
      },
      d: {
        data: [
          { id: 23444, doneBy: undefined, registeredBy: undefined },
          { id: 1455, doneBy: undefined, registeredBy: undefined }
        ],
        loading: false,
        rootNode: new MusitNode({ nodeId: 1, name: 'Test' })
      }
    };

    const clearEvents$ = testScheduler.createHotObservable(clearEventsM);
    const loadRootNode$ = testScheduler.createHotObservable(loadRootNodeM, {
      1: new MusitNode({
        nodeId: 1,
        name: 'Test'
      })
    });
    const loadEvents$ = testScheduler
      .createHotObservable(loadEventsM, {
        1: { nodeId: 1, museumId: 1, token: '1234' }
      })
      .switchMap(
        loadEvents({
          simpleGet: url => {
            if (url.indexOf('controls') > -1) {
              return Observable.of({
                response: [
                  {
                    id: 1455,
                    doneBy: 'eaf19dfb-ec28-4fbd-8602-e4be062e592c',
                    registeredBy: '97ce5637-6e6d-418e-bc45-a2637c9945f3'
                  }
                ]
              });
            } else if (url.indexOf('observations') > -1) {
              return Observable.of({
                response: [
                  {
                    id: 23444,
                    doneBy: 'eaf19dfb-ec28-4fbd-8602-e4be062e592b',
                    registeredBy: '97ce5637-6e6d-418e-bc45-a2637c9945f2'
                  }
                ]
              });
            }
          },
          simplePost: () => Observable.of({ response: [] })
        })
      );

    const state$ = store$({ clearEvents$, loadRootNode$, loadEvents$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
