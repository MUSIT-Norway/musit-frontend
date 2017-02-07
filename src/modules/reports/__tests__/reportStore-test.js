import {TestScheduler, Observable} from 'rxjs/Rx';
import assert from 'assert';
import {reducer$, loadKDReport} from '../reportStore';
import {createStore} from 'react-rxjs/dist/RxStore';
import Report from '../../../models/report';

describe('KDReportStore', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      console.log(JSON.stringify(actual, null, 2));
      console.log(JSON.stringify(expected, null, 2));
      return assert.deepEqual(actual, expected);
    });

    // mock streams

    const loadKDReportM = '1-----------';
    const expected      = 'a-----------';


    const loadKDReport$ = testScheduler.createHotObservable(loadKDReportM, {1: {data: {}}})
      .switchMap(loadKDReport({
        simpleGet: () => {
          return Observable.of({
              response: {
                kdreport: {
                  totalArea: '4666.3',
                  perimeterSecurity: '34.3',
                  theftProtection: '44.4',
                  fireProtection: '4566.333',
                  waterDamageAssessment: '344.3',
                  routinesAndContingencyPlan: '433.2'
                }
              }
            }
          );
        }
      })
      ({museumId: {getPath: () => 'museum'}, token: 'zxc'}));

    const expectedStateMap = {
      a: {
        data: new Report({
          kdreport: {
            totalArea: '4666.3',
            perimeterSecurity: '34.3',
            theftProtection: '44.4',
            fireProtection: '4566.333',
            waterDamageAssessment: '344.3',
            routinesAndContingencyPlan: '433.2'
          }
        }),
        loading: false
      }
    };

    // mock up$ and down$ events


    const state$ = reducer$({loadKDReport$});


    // assertion
    testScheduler.expectObservable(createStore('test', state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});