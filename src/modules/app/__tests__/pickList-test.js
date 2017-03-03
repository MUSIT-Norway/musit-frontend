/* eslint-disable */
import { TestScheduler, Subject, Observable } from 'rxjs/Rx';
import assert from 'assert';
import store$, { isItemAdded } from '../pickList';
const diff = require('deep-diff').diff;
import MusitObject from '../../../models/object';
import MuseumId from '../../../models/museumId';
import isEqual from 'lodash/isEqual';

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
      a: { nodes: [], objects: []},
      d: { objects: [{ marked: false, value: {id: 1}, path: []}], nodes: []},
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

    const refreshObjects$ = testScheduler.createHotObservable(refreshObjects, {
        1: { objectIds: [1], museumId: new MuseumId(99), token: '1224' },
        2: { objectIds: [1, 2], museumId: new MuseumId(99), token: '1224' }
    }).switchMap(MusitObject.getObjectLocations(
      (url, data) =>  {
        if (isEqual(data, [1])) return Observable.of({
          response: [
            {
              node: { id: 1456, path: ',3,', pathNames: [{nodeId: 3, name: 'test'}] },
              objectIds: [1]
            }
          ]
        });
        if (isEqual(data, [1, 2])) return Observable.of({
          response: [
            {
              node: { id: 14578, path: ',6,', pathNames: [{nodeId: 6, name: 'Code from Jarl'}] },
              objectIds: [1]
            },
            {
              node: { id: 14579, path: ',6,', pathNames: [{nodeId: 6, name: 'Code from Jarl'}] },
              objectIds: [2]
            }
          ]
        })
      }
    ));

    const state$ = store$({
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
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});


describe('pickList isItemAdded', () => {

  const node = {
    "id": 23,
    "nodeId": "775b4163-acea-4237-a558-8b1e004b9813",
    "name": "q3",
    "isPartOf": 2,
    "groupRead": "foo",
    "path": ",2,23,",
    "type": "Organisation",
    "updatedBy": "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
    "updatedDate": "2017-02-09T14:43:02+00:00",
    "breadcrumb": [{"id": 23, "name": "q3", "url": "/magasin/23"}, {"id": 23, "name": "q3", "url": "/magasin/23"}]
  };

  const nodePickList = [{
    "marked": false,
    "value": {
      "id": 21,
      "nodeId": "ab18d9be-a404-4147-8971-7514a53d0563",
      "name": "q1",
      "isPartOf": 2,
      "groupRead": "foo",
      "path": ",2,21,",
      "type": "Organisation",
      "updatedBy": "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
      "updatedDate": "2017-02-09T14:42:43+00:00",
      "breadcrumb": [{"id": 21, "name": "q1", "url": "/magasin/21"}, {"id": 21, "name": "q1", "url": "/magasin/21"}]
    },
    "path": [{"id": 2, "name": "Utenfor museet", "url": "/magasin/2"}]
  }, {
    "marked": false,
    "value": {
      "id": 22,
      "nodeId": "6d57c513-0a22-4718-baa0-91aa8483d966",
      "name": "q2",
      "isPartOf": 2,
      "groupRead": "foo",
      "path": ",2,22,",
      "type": "Organisation",
      "updatedBy": "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
      "updatedDate": "2017-02-09T14:42:53+00:00",
      "breadcrumb": [{"id": 22, "name": "q2", "url": "/magasin/22"}, {"id": 22, "name": "q2", "url": "/magasin/22"}]
    },
    "path": [{"id": 2, "name": "Utenfor museet", "url": "/magasin/2"}]
  }, {
    "marked": false,
    "value": {
      "id": 23,
      "nodeId": "775b4163-acea-4237-a558-8b1e004b9813",
      "name": "q3",
      "isPartOf": 2,
      "groupRead": "foo",
      "path": ",2,23,",
      "type": "Organisation",
      "updatedBy": "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
      "updatedDate": "2017-02-09T14:43:02+00:00",
      "breadcrumb": [{"id": 23, "name": "q3", "url": "/magasin/23"}, {"id": 23, "name": "q3", "url": "/magasin/23"}]
    },
    "path": [{"id": 2, "name": "Utenfor museet", "url": "/magasin/2"}]
  }];

  it('Testing node in isItemAdded function', () => {
    expect(isItemAdded(node, nodePickList)).toBe(true);
  });

  const object = {"id": 15, "museumId": 99, "museumNo": "MusK24", "subNo": "a", "term": "Lendeklede"}

  const objectPickList = [{
    "marked": false,
    "value": {"id": 15, "museumId": 99, "museumNo": "MusK24", "subNo": "a", "term": "Lendeklede"},
    "path": [{"id": 2, "name": "Utenfor museet", "url": "/magasin/2"}]
  }, {
    "marked": false,
    "value": {"id": 16, "museumId": 99, "museumNo": "MusK24", "subNo": "b", "term": "Kokekar"},
    "path": [{"id": 2, "name": "Utenfor museet", "url": "/magasin/2"}]
  }, {
    "marked": false,
    "value": {"id": 20, "museumId": 99, "museumNo": "MusK33", "term": "Bronsjespenne"},
    "path": [{"id": 2, "name": "Utenfor museet", "url": "/magasin/2"}]
  }, {
    "marked": false,
    "value": {"id": 21, "museumId": 99, "museumNo": "MusK34", "subNo": "a", "term": "Kniv"},
    "path": [{"id": 2, "name": "Utenfor museet", "url": "/magasin/2"}]
  }, {
    "marked": false,
    "value": {"id": 22, "museumId": 99, "museumNo": "MusK34", "subNo": "b", "term": "Spydspiss"},
    "path": [{"id": 2, "name": "Utenfor museet", "url": "/magasin/2"}]
  }]

  it('Testing object in isItemAdded function', () => {
    expect(isItemAdded(object, objectPickList)).toBe(true);
  });
});