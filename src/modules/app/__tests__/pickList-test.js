/* eslint-disable */
import { TestScheduler, Subject } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$ } from '../pickList';
import { createStore } from 'react-rxjs/dist/RxStore';
const diff = require('deep-diff').diff;

describe('pickList', () => {

  it('testing and clear', () => {
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
    const toggleNode        = '---------------11--------';
    const refreshNode       = '-----------------1-------';
    const clearNodes        = '--------x----------------';
    const removeObject      = '---------1---------------';
    const removeNode        = '------------------1------';
    const addNode           = '----1-------121----------';
    const clearObjects      = '----------x--------------';
    const addObject         = '---1---------------1--2--';
    const refreshObjects    = '---------------------1--2';
    const expected          = 'a--de---fng-hijkjlop-rs-u';

    const expectedStateMap = {
      a: {},
      d: { objects: [{ marked: false, value: {id: 1}, path: []}]},
      e: { objects: [{ marked: false, value: {id: 1}, path: []}], nodes: [{marked: false, value: {id: 1}, path: []}]},
      f: { objects: [{ marked: false, value: {id: 1}, path: []}], nodes: []},
      n: { objects: [], nodes: []},
      g: { objects: [], nodes: []},
      h: { objects: [], nodes: [{ marked: false, value: {id: 1}, path: [] }]},
      i: { objects: [], nodes: [{ marked: false, value: {id: 1}, path: [] }, { marked: false, value: {id: 2}, path: [] }]},
      j: { objects: [], nodes: [{ marked: false, value: {id: 1}, path: [] }, { marked: false, value: {id: 2}, path: [] }]},
      k: { objects: [], nodes: [{ marked: true, value: {id: 1}, path: [] }, { marked: false, value: {id: 2}, path: [] }]},
      l: { objects: [], nodes: [{ marked: false, value: {id: 1}, path: [] }, { marked: false, value: {id: 2}, path: [{id: 1, name: 'Test', url: '/magasin/1'}] }]},
      o: { objects: [], nodes: [{ marked: false, value: {id: 1}, path: [] }]},
      p: { objects: [{ marked: false, value: {id: 1}, path: []}], nodes: [{ marked: false, value: {id: 1}, path: [] }]},
      r: {
        objects: [{ marked: false, value: {id: 1}, path: [{id: 3, name: 'test', url: '/magasin/3'}]}],
        nodes: [{ marked: false, value: {id: 1}, path: [] }]
      },
      s: {
        objects: [{ marked: false, value: {id: 1}, path: [{id: 3, name: 'test', url: '/magasin/3'}]},
          { marked: false, value: {id: 2}, path: []}
        ],
        nodes: [{ marked: false, value: {id: 1}, path: [] }]
      },
      u: {
        objects: [{ marked: false, value: {id: 1}, path: [{id: 6, name: 'Code from Jarl', url: '/magasin/6'}]},
                  { marked: false, value: {id: 2}, path: [{id: 6, name: 'Code from Jarl', url: '/magasin/6'}]}
        ],
        nodes: [{ marked: false, value: {id: 1}, path: [] }]
      }
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
    const clearObjects$ = testScheduler.createHotObservable(clearObjects);
    const addObject$ = testScheduler.createHotObservable(addObject, {1: {value: {id: 1}, path: []}, 2: {value: {id: 2}, path: []}});

    const refreshObjects$ = testScheduler.createHotObservable(refreshObjects,
      {
        1: [{ id: 1456, objectId: 1, path: ',3,', pathNames: [{nodeId: 3, name: 'test'}]}],
        2: [{ id: 14578, objectId: 1, path: ',6,', pathNames: [{nodeId: 6, name: 'Code from Jarl'}]},
            { id: 14579, objectId: 2, path: ',6,', pathNames: [{nodeId: 6, name: 'Code from Jarl'}]}
        ],
      });

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
      refreshMainObject$,
      refreshObjects$
    });

    // assertion
    testScheduler.expectObservable(createStore('test', state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});