import { TestScheduler, Subject, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$, initialState, searchForObjects } from '../objectSearchStore';
import { createStore } from 'react-rxjs/dist/RxStore';
import MusemId from '../../../models/museumId';
import CollectionId from '../../../models/collectionId';

describe('objectSearchStore', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      console.log(JSON.stringify(actual, null, 2));
      console.log(JSON.stringify(expected, null, 2));
      return assert.deepEqual(actual, expected);
    });

    // mock streams
    const searchForObjectsdM= '--x-------------'
    const onChangeFieldM    = '-x--------------'
    const expected          = 'abc-------------';

    const expectedStateMap = {
      a: initialState,
      b: {
        ...initialState,
        params: {
          ...initialState.params,
          test: 'hallo'
        }
      },
      c: {
        ...initialState,
        params: {
          ...initialState.params,
          test: 'hallo'
        },
        data: {

        }
      }
    };

    // mock up$ and down$ events
    const clearSearch$ =  new Subject();
    const searchForObjects$ = testScheduler.createHotObservable(searchForObjectsdM,
      {x: { params: {}, token: '12344', museumId: new MusemId(1), collectionId: new CollectionId('12345')}}
    ).switchMap(searchForObjects({
      simpleGet: () => {
        return Observable.of({
          response: {
            totalMatches: 0,
            matches: [

            ]
          }
        })
      }
    }));
    const onChangeField$ = testScheduler.createHotObservable(onChangeFieldM, {x: {field: 'test', value: 'hallo'}});

    const state$ = reducer$({clearSearch$, searchForObjects$, onChangeField$});

    // assertion
    testScheduler.expectObservable(createStore('test', state$, Observable.of(initialState))).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});