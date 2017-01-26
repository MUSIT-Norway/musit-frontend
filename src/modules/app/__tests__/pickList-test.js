/* eslint-disable */
import { TestScheduler, Subject } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$ } from '../pickList';
import { createStore } from '../../../rxjs/RxStore';

describe('pickList', () => {

  it('testing and clear', () => {
    const testScheduler = new TestScheduler(assert.deepEqual.bind(assert));

    // mock streams
    const toggleNode        = '---------------11--';
    const refreshNode       = '-----------------1-';
    const refreshObject     = '------1------------';
    const clearNodes        = '--------x----------';
    const removeObject      = '---------1---------';
    const removeNode        = '------------------1';
    const addNode           = '----1-------121----';
    const clearObjects      = '----------x--------';
    const addObject         = '---1---------------';
    const expected          = 'a--de-m-fng-hijkjlo';

    const expectedStateMap = {
      a: {},
      d: { objects: [{ marked: false, value: {id: 1}, path: []}]},
      e: { objects: [{ marked: false, value: {id: 1}, path: []}], nodes: [{marked: false, value: {id: 1}, path: []}]},
      m: { objects: [{ marked: false, value: {id: 1}, path: [{id: 1, name: 'Test', url: '/magasin/1'}, {id: 2, name: 'Tull', url: '/magasin/2'}]}], nodes: [{marked: false, value: {id: 1}, path: []}]},
      f: { objects: [{ marked: false, value: {id: 1}, path: [{id: 1, name: 'Test', url: '/magasin/1'}, {id: 2, name: 'Tull', url: '/magasin/2'}]}], nodes: []},
      n: { objects: [], nodes: []},
      g: { objects: [], nodes: []},
      h: { objects: [], nodes: [{ marked: false, value: {id: 1}, path: [] }]},
      i: { objects: [], nodes: [{ marked: false, value: {id: 1}, path: [] }, { marked: false, value: {id: 2}, path: [] }]},
      j: { objects: [], nodes: [{ marked: false, value: {id: 1}, path: [] }, { marked: false, value: {id: 2}, path: [] }]},
      k: { objects: [], nodes: [{ marked: true, value: {id: 1}, path: [] }, { marked: false, value: {id: 2}, path: [] }]},
      l: { objects: [], nodes: [{ marked: false, value: {id: 1}, path: [] }, { marked: false, value: {id: 2}, path: [{id: 1, name: 'Test', url: '/magasin/1'}] }]},
      o: { objects: [], nodes: [{ marked: false, value: {id: 1}, path: [] }]}
    };

    // mock up$ and down$ events
    const toggleNode$ = testScheduler.createHotObservable(toggleNode, {1: {item: {id: 1}}});
    const removeNode$ = testScheduler.createHotObservable(removeNode, {1: {id: 2, name: 'Tull'}});
    const refreshNode$ = testScheduler.createHotObservable(refreshNode, {1: {id: 2, path: ',1,2,', pathNames: [{nodeId: 1, name: 'Test'}]}});
    const clearNodes$ = testScheduler.createHotObservable(clearNodes);
    const addNode$ = testScheduler.createHotObservable(addNode, {1: {value: {id: 1}, path: []}, 2: {value: {id: 2}, path: []}});
    const toggleObject$ = new Subject();
    const toggleMainObject$ = new Subject();
    const refreshMainObject$ = new Subject();
    const removeObject$ = testScheduler.createHotObservable(removeObject, {1: {id: 1, museumNo: 'H1'}});
    const refreshObject$ = testScheduler.createHotObservable(refreshObject,
      {1: {id: 1, museumNo: 'H1', path: ',1,2,', pathNames: [{nodeId: 1, name: 'Test'}, {nodeId: 2, name: 'Tull'}]}});
    const clearObjects$ = testScheduler.createHotObservable(clearObjects);
    const addObject$ = testScheduler.createHotObservable(addObject, {1: {value: {id: 1}, path: []}});

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