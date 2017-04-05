import { TestScheduler } from 'rxjs/Rx';
import assert from 'assert';
import { store$ } from '../nodeStore';
const diff = require('deep-diff').diff;

describe('nodeStore', () => {
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
    const clearNodeM = '-1---------';
    const loadNodeM = '--1--------';
    const updateStateM = '---1-------';
    const expected = 'abcd-------';

    const expectedStateMap = {
      a: {
        unit: {
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {}
        },
        loaded: false
      },
      b: {
        unit: {
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {}
        },
        loaded: false
      },
      c: {
        unit: {
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {}
        },
        loaded: true,
        rootNode: { foo: 'bar' }
      },
      d: {
        unit: {
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {},
          bar: 'foo'
        },
        loaded: true,
        rootNode: { foo: 'bar' }
      }
    };

    // mock up$ and down$ events
    const clearNode$ = testScheduler.createHotObservable(clearNodeM);
    const loadNode$ = testScheduler.createHotObservable(loadNodeM, { 1: { foo: 'bar' } });
    const updateState$ = testScheduler.createHotObservable(updateStateM, {
      1: { bar: 'foo' }
    });

    const state$ = store$({ clearNode$, loadNode$, updateState$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
