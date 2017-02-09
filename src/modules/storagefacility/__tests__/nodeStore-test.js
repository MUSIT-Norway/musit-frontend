import { TestScheduler } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$ } from '../nodeStore';
import { createStore } from 'react-rxjs/dist/RxStore';
const diff = require('deep-diff').diff;

describe('nodeStore', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });
    // mock streams
    const clearNodeM        = '-1---------';
    const loadNodeM         = '--1--------';
    const updateStateM      = '---1-------';
    const expected          = 'abcd-------';

    const expectedStateMap = {
      a: {},
      b: {
        unit: {
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {}
        }
      },
      c: {
        unit: {
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {}
        },
        rootNode: { foo: 'bar' }
      },
      d: {
        unit: {
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {},
          bar: 'foo'
        },
        rootNode: { foo: 'bar' }
      }
    };

    // mock up$ and down$ events
    const clearNode$ = testScheduler.createHotObservable(clearNodeM);
    const loadNode$ = testScheduler.createHotObservable(loadNodeM, { 1: { foo: 'bar' }});
    const updateState$ = testScheduler.createHotObservable(updateStateM, { 1: { bar: 'foo' }});

    const state$ = reducer$({clearNode$, loadNode$, updateState$});

    // assertion
    testScheduler.expectObservable(createStore('test', state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});