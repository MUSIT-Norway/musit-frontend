import {TestScheduler} from 'rxjs/Rx';
import assert from 'assert';
import { reducer$ } from '../pickList';
import { createStore } from '../../../state/RxStore';

describe('pickList', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler(assert.deepEqual.bind(assert));

    // mock streams
    const clearNodes        = '--------x------';
    const addNode           = '----1----------';
    const clearObjects      = '----------x----';
    const addObject         = '---1-----------';
    const expected          = 'a--de---f-g----';

    const expectedStateMap = {
      a: {},
      d: { objects: [{ marked: false, value: {}, path: []}]},
      e: { objects: [{ marked: false, value: {}, path: []}], nodes: [{ marked: false, value: {}, path: []}]},
      f: { objects: [{ marked: false, value: {}, path: []}], nodes: []},
      g: { objects: [], nodes: []},
    };

    // mock up$ and down$ events
    const clearNodes$ = testScheduler.createHotObservable(clearNodes);
    const addNode$ = testScheduler.createHotObservable(addNode, { 1: { value: {}, path: []}});
    const clearObjects$ = testScheduler.createHotObservable(clearObjects);
    const addObject$ = testScheduler.createHotObservable(addObject, { 1: { value: {}, path: []}});

    const state$ = reducer$({clearObjects$, addObject$, clearNodes$, addNode$});

    // assertion
    testScheduler.expectObservable(createStore(state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  })
});