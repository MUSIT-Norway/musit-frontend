import { TestScheduler, Subject } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$ } from '../pickList';
import { createStore } from '../../../rxjs/RxStore';

describe('pickList', () => {

  it('testing and clear', () => {
    const testScheduler = new TestScheduler(assert.deepEqual.bind(assert));

    // mock streams
    const toggleNode        = '---------------11';
    const clearNodes        = '--------x--------';
    const addNode           = '----1-------121--';
    const clearObjects      = '----------x------';
    const addObject         = '---1-------------';
    const expected          = 'a--de---f-g-hijkj';

    const expectedStateMap = {
      a: {},
      d: { objects: [{ marked: false, value: { id: 1 }, path: []}]},
      e: { objects: [{ marked: false, value: { id: 1 }, path: []}], nodes: [{ marked: false, value: { id: 1 }, path: []}]},
      f: { objects: [{ marked: false, value: { id: 1 }, path: []}], nodes: []},
      g: { objects: [], nodes: []},
      h: { objects: [], nodes: [{ marked: false, value: { id: 1 }, path: []}]},
      i: { objects: [], nodes: [{ marked: false, value: { id: 1 }, path: []}, { marked: false, value: { id: 2 }, path: []}]},
      j: { objects: [], nodes: [{ marked: false, value: { id: 1 }, path: []}, { marked: false, value: { id: 2 }, path: []}]},
      k: { objects: [], nodes: [{ marked: true, value: { id: 1 }, path: []}, { marked: false, value: { id: 2 }, path: []}]}
    };

    // mock up$ and down$ events
    const toggleNode$ = testScheduler.createHotObservable(toggleNode, { 1: { item: { id: 1 } } });
    const removeNode$ = new Subject();
    const refreshNode$ = new Subject();
    const clearNodes$ = testScheduler.createHotObservable(clearNodes);
    const addNode$ = testScheduler.createHotObservable(addNode, { 1: { value: { id: 1 }, path: []}, 2: { value: { id: 2 }, path: []}});
    const toggleObject$ = new Subject();
    const toggleMainObject$ = new Subject();
    const removeObject$ = new Subject();
    const refreshObject$ = new Subject();
    const refreshMainObject$ = new Subject();
    const clearObjects$ = testScheduler.createHotObservable(clearObjects);
    const addObject$ = testScheduler.createHotObservable(addObject, { 1: { value: { id: 1 }, path: []}});

    const state$ = reducer$({
      clearObjects$,
      removeObject$,
      toggleObject$,
      toggleMainObject$,
      addObject$,
      clearNodes$,
      removeNode$,
      toggleNode$,
      addNode$,
      refreshNode$,
      refreshObject$,
      refreshMainObject$
    });

    // assertion
    testScheduler.expectObservable(createStore(state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});