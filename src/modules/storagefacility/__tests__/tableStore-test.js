import {TestScheduler} from "rxjs/Rx";
import assert from 'assert';
import { reducer$ } from '../tableStore';
import { createStore } from '../../../state/RxStore';

describe('tableStore', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler(assert.deepEqual.bind(assert));

    // mock streams
    const nullMarbles =       "--------------";
    const setLoadingM =       "-x------------";
    const loadingChildrenM =  "------1--2----";
    const expected =          "ab----c--d----";

    const expectedStateMap = {
      a: {},
      b: { children: { loading: true, data: null} },
      c: { children: { loading: false, data: { matches: [], totalMatches: 0 }} },
      d: { children: { loading: false, data: { matches: [{ name: 'en node', nodeId: 'uuid', id: 1}], totalMatches: 1 }} }
    };

    // mock up$ and down$ events
    const clearRootNode$ = testScheduler.createHotObservable(nullMarbles);
    const setLoading$ = testScheduler.createHotObservable(setLoadingM);
    const loadChildren$ = testScheduler.createHotObservable(loadingChildrenM, { 1: { matches: [], totalMatches: 0}, 2: { matches: [{ name: 'en node', nodeId: 'uuid', id: 1}], totalMatches: 1 }});
    const loadStats$ = testScheduler.createHotObservable(nullMarbles);
    const deleteNode$ = testScheduler.createHotObservable(nullMarbles);
    const loadRootNode$ = testScheduler.createHotObservable(nullMarbles);

    const state$ = reducer$({clearRootNode$, setLoading$, loadChildren$, loadStats$, deleteNode$, loadRootNode$});

    // assertion
    testScheduler.expectObservable(createStore(state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});