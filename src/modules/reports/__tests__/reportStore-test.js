import { store$ } from '../reportStore';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

describe('KDReportStore', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();

    // mock streams

    const loadKDReportM = '-1-----------';
    const clearM = '--x----------';
    const expected = 'abc----------';

    const loadKDReport$ = testScheduler.createHotObservable(loadKDReportM, {
      1: {
        totalArea: 4666.3,
        perimeterSecurity: 34.3,
        theftProtection: 44.4,
        fireProtection: 4566.333,
        waterDamageAssessment: 344.3,
        routinesAndContingencyPlan: 433.2
      }
    });

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
        data: {},
        loaded: false
      }
    };

    // mock up$ and down$ events

    const state$ = store$({ loadKDReport$, clear$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
