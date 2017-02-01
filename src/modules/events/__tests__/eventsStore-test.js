import { TestScheduler, Subject, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$, loadEvents, loadRootNode } from '../eventsStore';
import { createStore } from 'react-rxjs/dist/RxStore';
import MuseumId from '../../../models/museumId';
import Observation from '../../../models/observation';
import Control from '../../../models/control';
import MusitNode from '../../../models/node';

describe('eventsStore', () => {

  it('testing reducer with actors', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      // console.log(JSON.stringify(actual, null, 2));
      // console.log(JSON.stringify(expected, null, 2));
      return assert.deepEqual(actual, expected);
    });

    // mock streams
    const clearEventsM      = '--1------------';
    const loadEventsM       = '-1-------------';
    const expected          = 'abc------------';

    const expectedStateMap = {
      a: {
        data: []
      },
      b: {
        data: [
          new Observation({ id: 23444, doneBy: 'Test 2', registeredBy: 'Test 3' }),
          new Control({ id: 1455, doneBy: 'Test 1', registeredBy: 'Test 4' })
        ]
      },
      c: {
        data: []
      }
    };

    const clearEvents$ = testScheduler.createHotObservable(clearEventsM);
    const loadRootNode$ = new Subject();
    const loadEvents$ = testScheduler.createHotObservable(loadEventsM, {1: {nodeId: 1, museumId: new MuseumId(1), token: '1234'}})
      .switchMap(loadEvents({
        simpleGet: (url) => {
          if (url.indexOf('controls') > -1) {
            return Observable.of([
              {
                id: 1455,
                doneBy: 'eaf19dfb-ec28-4fbd-8602-e4be062e592c',
                registeredBy: '97ce5637-6e6d-418e-bc45-a2637c9945f3'
              }
            ]);
          } else if(url.indexOf('observations') > -1) {
            return Observable.of([
              {
                id: 23444,
                doneBy: 'eaf19dfb-ec28-4fbd-8602-e4be062e592b',
                registeredBy: '97ce5637-6e6d-418e-bc45-a2637c9945f2'
              }
            ]);
          }
        },
        simplePost: () => Observable.of([
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
        ])
      }));

    const state$ = reducer$({ clearEvents$, loadRootNode$, loadEvents$ });

    // assertion
    testScheduler.expectObservable(createStore('test', state$, Observable.of({ data: []}))).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });

  it('testing reducer with no actor hits', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      // console.log(JSON.stringify(actual, null, 2));
      // console.log(JSON.stringify(expected, null, 2));
      return assert.deepEqual(actual, expected);
    });

    // mock streams
    const loadRootNodeM     = '---1-----------';
    const clearEventsM      = '--1------------';
    const loadEventsM       = '-1-------------';
    const expected          = 'abcd-----------';

    const expectedStateMap = {
      a: {
        data: []
      },
      b: {
        data: [
          new Observation({ id: 23444, doneBy: undefined, registeredBy: undefined }),
          new Control({ id: 1455, doneBy: undefined, registeredBy: undefined })
        ]
      },
      c: {
        data: []
      },
      d: {
        data: [],
        rootNode: new MusitNode({nodeId: 1, name: 'Test'})
      }
    };

    const clearEvents$ = testScheduler.createHotObservable(clearEventsM);
    const loadRootNode$ = testScheduler.createHotObservable(loadRootNodeM, {1: {nodeId: 1, museumId: new MuseumId(1), token: '1234'}})
      .switchMap(loadRootNode({
        simpleGet: () => {
          return Observable.of({
            nodeId: 1,
            name: 'Test'
          });
        }
      }));
    const loadEvents$ = testScheduler.createHotObservable(loadEventsM, {1: {nodeId: 1, museumId: new MuseumId(1), token: '1234'}})
      .switchMap(loadEvents({
        simpleGet: (url) => {
          if (url.indexOf('controls') > -1) {
            return Observable.of([
              {
                id: 1455,
                doneBy: 'eaf19dfb-ec28-4fbd-8602-e4be062e592c',
                registeredBy: '97ce5637-6e6d-418e-bc45-a2637c9945f3'
              }
            ]);
          } else if(url.indexOf('observations') > -1) {
            return Observable.of([
              {
                id: 23444,
                doneBy: 'eaf19dfb-ec28-4fbd-8602-e4be062e592b',
                registeredBy: '97ce5637-6e6d-418e-bc45-a2637c9945f2'
              }
            ]);
          }
        },
        simplePost: () => Observable.of(null)
      }));

    const state$ = reducer$({ clearEvents$, loadRootNode$, loadEvents$ });

    // assertion
    testScheduler.expectObservable(createStore('test', state$, Observable.of({ data: []}))).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});