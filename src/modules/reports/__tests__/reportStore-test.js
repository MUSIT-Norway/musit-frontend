import {TestScheduler} from 'rxjs/Rx';
import assert from 'assert';
import { reducer$ } from '../reportStore';
import {createStore} from 'react-rxjs/dist/RxStore';

describe('KDReportStore', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      // console.log(JSON.stringify(actual, null, 2));
      // console.log(JSON.stringify(expected, null, 2));
      return assert.deepEqual(actual, expected);
    });

    // mock streams

    const loadKDReportM = '-1-----------';
    const clearM        = '--x----------';
    const expected      = 'abc----------';

    const loadKDReport$ = testScheduler.createHotObservable(loadKDReportM, {1: {
      totalArea: 4666.3,
      perimeterSecurity: 34.3,
      theftProtection: 44.4,
      fireProtection: 4566.333,
      waterDamageAssessment: 344.3,
      routinesAndContingencyPlan: 433.2
    }});

    const clear$ = testScheduler.createHotObservable(clearM);

    const expectedStateMap = {
      b: {
        data: {
          kdreport: {
            totalArea: 4666.3,
            perimeterSecurity: 34.3,
            theftProtection: 44.4,
            fireProtection: 4566.333,
            waterDamageAssessment: 344.3,
            routinesAndContingencyPlan: 433.2
          }
        },
        loaded: true
      },
      c: {
        data: {},
        loaded: false
      },
      a: {
      }
    };

    // mock up$ and down$ events


    const state$ = reducer$({loadKDReport$, clear$});


    // assertion
    testScheduler.expectObservable(createStore('test', state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});