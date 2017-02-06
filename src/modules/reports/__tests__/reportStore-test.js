import { TestScheduler, Subject } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$ } from '../reportStore';
import { createStore } from 'react-rxjs/dist/RxStore';

describe('KDReportStore', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler(assert.deepEqual.bind(assert));

    // mock streams
    const nullMarbles       = '--------------';
    const setLoadingM       = '-x------------';
    const loadingChildrenM  = '------1--2----';
    const expected          = 'ab----c--d----';

    const expectedStateMap = {
      a: {},
      b: { data: {
        kdreport:
        {totalArea: '4666.3',
          perimeterSecurity: '34.3',
          theftProtection: '44.4',
          fireProtection: '4566.333',
          waterDamageAssessment:'344.3',
          routinesAndContingencyPlan: '433.2'
        }} }
    };

    // mock up$ and down$ events
    const clearRootNode$ = testScheduler.createHotObservable(nullMarbles);
    const setLoading$ = testScheduler.createHotObservable(setLoadingM);
    const loadNodes$ = testScheduler.createHotObservable(loadingChildrenM, {
      1: { matches: [], totalMatches: 0},
      2: { matches: [{ name: 'en node', nodeId: 'uuid', id: 1}], totalMatches: 1 }
    });
    const loadObjects$ = new Subject();
    const loadStats$ = testScheduler.createHotObservable(nullMarbles);
    const deleteNode$ = testScheduler.createHotObservable(nullMarbles);
    const loadRootNode$ = testScheduler.createHotObservable(nullMarbles);

    const state$ = reducer$({clearRootNode$, setLoading$, loadNodes$, loadObjects$, loadStats$, deleteNode$, loadRootNode$});

    // assertion
    testScheduler.expectObservable(createStore('test', state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});