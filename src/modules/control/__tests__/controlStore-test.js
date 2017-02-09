import { TestScheduler, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$, initialState, getControl } from '../controlStore';
import { createStore } from 'react-rxjs/dist/RxStore';
import MusemId from '../../../models/museumId';

describe('ControlStore', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      console.log(JSON.stringify(actual, null, 2));
      console.log(JSON.stringify(expected, null, 2));
      // console.log(JSON.stringify(expectedStateMap, null, 2));
      return assert.deepEqual(actual, expected);
    });

    // mock streams
    const getControlM= '-x-------------';
    const expected   = 'ab-------------';

    const expectedStateMap = {
      a: initialState,
      b: {
        data: {
          'id':51,
          'doneBy':'7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          'doneDate':'2017-02-09T09:52:11+00:00',
          'affectedThing':3,
          'registeredBy':'7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          'registeredDate':'2017-02-09T09:52:26+00:00',
          'eventType':'Control',
          'alcohol':{
            'ok':true
          },
          'cleaning':{
            'ok':true
          },
          'gas':{
            'ok':true
          },
          'hypoxicAir':{
            'ok':true
          },
          'lightingCondition':{
            'ok':true
          },
          'mold':{
            'ok':true
          },
          'pest':{
            'ok':true
          },
          'relativeHumidity':{
            'ok':true
          },
          'temperature':{
            'ok':true
          }
        }
      }
    };

    // mock up$ and down$ events
    const getControl$ = testScheduler.createHotObservable(getControlM,
      {x: { token: '12344', museumId: new MusemId(1), nodeId: 1, controlId: 2}}
    ).switchMap(getControl({
      simpleGet: () => {
        return Observable.of({
          response: {
            'id':51,
            'doneBy':'7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
            'doneDate':'2017-02-09T09:52:11+00:00',
            'affectedThing':3,
            'registeredBy':'7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
            'registeredDate':'2017-02-09T09:52:26+00:00',
            'eventType':'Control',
            'alcohol':{
              'ok':true
            },
            'cleaning':{
              'ok':true
            },
            'gas':{
              'ok':true
            },
            'hypoxicAir':{
              'ok':true
            },
            'lightingCondition':{
              'ok':true
            },
            'mold':{
              'ok':true
            },
            'pest':{
              'ok':true
            },
            'relativeHumidity':{
              'ok':true
            },
            'temperature':{
              'ok':true
            }
          }
        });
      }
    }));

    const state$ = reducer$({ getControl$ });

    // assertion
    testScheduler.expectObservable(createStore('test', state$, Observable.of(initialState))).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});