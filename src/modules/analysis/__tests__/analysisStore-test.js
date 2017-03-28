import { TestScheduler } from 'rxjs/Rx';
import assert from 'assert';
import MuseumId from '../../../models/museumId';
import Analysis from '../../../models/analysis';
import { store$, objectsData } from '../analysisStore';
import { Observable } from 'rxjs';
const diff = require('deep-diff').diff;

describe('analysisStore', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      // console.log(JSON.stringify(actual, null, 2));
      // console.log(JSON.stringify(expected, null, 2));
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    // mock streams
    const loadAnalyseTypesM = '-1---------';
    const expected          = 'ab---------';

    const expectedStateMap = {
      a: {
        objectsData,
        data: {
          analysisTypes: []
        }
      },
      b: {
        objectsData,
        data: {
          analysisTypes: [{}, {}, {}]
        }
      }
    };

    // mock up$ and down$ events
    const loadAnalysisTypes$ = testScheduler.createHotObservable(loadAnalyseTypesM, { 1: { museumId: new MuseumId(99), token: '1234' } })
        .flatMap(Analysis.getAllAnalysisTypes(() =>
          Observable.of({
            response: [{}, {}, {}]
          })
        ));

    const state$ = store$({loadAnalysisTypes$});

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});