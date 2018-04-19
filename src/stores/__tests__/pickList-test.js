// @flow
import { Subject, Observable } from 'rxjs/Rx';
import { store$, isItemAdded } from '../pickList';
import MusitObject from '../../models/object';
import isEqual from 'lodash/isEqual';
import MusitTestScheduler from '../../testutils/MusitTestScheduler';

describe('pickList', () => {
  it('testing and clear', () => {
    const testScheduler = new MusitTestScheduler();
    // mock streams
    const toggleNode = '---------------11---------';
    const refreshNode = '-----------------1--------';
    const clearNodes = '--------x-----------------';
    const removeObject = '---------1----------------';
    const removeNode = '------------------1-------';
    const addNode = '----1-------121-----------';
    const clearObjects = '----------x---------------';
    const addObject = '---1---------------3--2---';
    const refreshObjects = '---------------------1--2-';
    const addObjects = '-------------------------1';

    const expected = 'a--de---fng-hijkjlop-rs-uv';

    const expectedStateMap = {
      a: { nodes: [], objects: [], adding: false },
      d: {
        objects: [{ marked: false, value: { id: 1 }, path: [] }],
        nodes: [],
        adding: false
      },
      e: {
        objects: [{ marked: false, value: { id: 1 }, path: [] }],
        nodes: [{ marked: false, value: { id: 1 }, path: [] }],
        adding: false
      },
      f: {
        objects: [{ marked: false, value: { id: 1 }, path: [] }],
        nodes: [],
        adding: false
      },
      n: { objects: [], nodes: [], adding: false },
      g: { objects: [], nodes: [], adding: false },
      h: {
        objects: [],
        nodes: [{ marked: false, value: { id: 1 }, path: [] }],
        adding: false
      },
      i: {
        objects: [],
        nodes: [
          { marked: false, value: { id: 1 }, path: [] },
          { marked: false, value: { id: 2 }, path: [] }
        ],
        adding: false
      },
      j: {
        objects: [],
        nodes: [
          { marked: false, value: { id: 1 }, path: [] },
          { marked: false, value: { id: 2 }, path: [] }
        ],
        adding: false
      },
      k: {
        objects: [],
        nodes: [
          { marked: true, value: { id: 1 }, path: [] },
          { marked: false, value: { id: 2 }, path: [] }
        ],
        adding: false
      },
      l: {
        objects: [],
        nodes: [
          { marked: false, value: { id: 1 }, path: [] },
          {
            marked: false,
            value: { id: 2 },
            path: [
              {
                id: '0615c304-e7ec-46ad-aebc-399884181eaf',
                nodeId: '0615c304-e7ec-46ad-aebc-399884181eaf',
                name: 'Test',
                url: '/magasin/0615c304-e7ec-46ad-aebc-399884181eaf'
              }
            ]
          }
        ],
        adding: false
      },
      o: {
        objects: [],
        nodes: [{ marked: false, value: { id: 1 }, path: [] }],
        adding: false
      },
      p: {
        objects: [{ marked: false, value: { id: 3, uuid: 3 }, path: [] }],
        nodes: [{ marked: false, value: { id: 1 }, path: [] }],
        adding: false
      },
      r: {
        objects: [
          {
            marked: false,
            value: { id: 3, uuid: 3 },
            path: [
              {
                id: '403cebde-082c-4002-8f78-16ad178a054a',
                nodeId: '403cebde-082c-4002-8f78-16ad178a054a',
                name: 'test',
                url: '/magasin/403cebde-082c-4002-8f78-16ad178a054a'
              }
            ]
          }
        ],
        nodes: [{ marked: false, value: { id: 1 }, path: [] }],
        adding: false
      },
      s: {
        objects: [
          {
            marked: false,
            value: { id: 3, uuid: 3 },
            path: [
              {
                id: '403cebde-082c-4002-8f78-16ad178a054a',
                nodeId: '403cebde-082c-4002-8f78-16ad178a054a',
                name: 'test',
                url: '/magasin/403cebde-082c-4002-8f78-16ad178a054a'
              }
            ]
          },
          { marked: false, value: { id: 2, uuid: 2 }, path: [] }
        ],
        nodes: [{ marked: false, value: { id: 1 }, path: [] }],
        adding: false
      },
      u: {
        objects: [
          {
            marked: false,
            value: { id: 3, uuid: 3 },
            path: [
              {
                id: '403cebde-082c-4002-8f78-16ad178a054a',
                nodeId: '403cebde-082c-4002-8f78-16ad178a054a',
                name: 'test',
                url: '/magasin/403cebde-082c-4002-8f78-16ad178a054a'
              }
            ]
          },
          {
            marked: false,
            value: { id: 2, uuid: 2 },
            path: [
              {
                id: '403cebde-082c-4002-8f78-16ad178a054a',
                nodeId: '403cebde-082c-4002-8f78-16ad178a054a',
                name: 'test',
                url: '/magasin/403cebde-082c-4002-8f78-16ad178a054a'
              }
            ]
          }
        ],
        nodes: [{ marked: false, value: { id: 1 }, path: [] }],
        adding: false
      },
      v: {
        objects: [
          {
            marked: false,
            value: { id: 3, uuid: 3 },
            path: [
              {
                id: '403cebde-082c-4002-8f78-16ad178a054a',
                nodeId: '403cebde-082c-4002-8f78-16ad178a054a',
                name: 'test',
                url: '/magasin/403cebde-082c-4002-8f78-16ad178a054a'
              }
            ]
          },
          {
            marked: false,
            value: { id: 2, uuid: 2 },
            path: [
              {
                id: '403cebde-082c-4002-8f78-16ad178a054a',
                nodeId: '403cebde-082c-4002-8f78-16ad178a054a',
                name: 'test',
                url: '/magasin/403cebde-082c-4002-8f78-16ad178a054a'
              }
            ]
          },
          {
            marked: true,
            value: { id: 7, uuid: 7 },
            path: []
          },
          {
            marked: true,
            value: { id: 8, uuid: 8 },
            path: []
          },
          {
            marked: true,
            value: { id: 9, uuid: 9 },
            path: []
          }
        ],
        nodes: [{ marked: false, value: { id: 1 }, path: [] }],
        adding: false
      }
    };

    // mock up$ and down$ events
    const markNode$ = testScheduler.createHotObservable(toggleNode, {
      '1': { item: { id: 1 } }
    });
    const removeNode$ = testScheduler.createHotObservable(removeNode, {
      '1': { id: 2, name: 'Tull' }
    });
    const refreshNode$ = testScheduler.createHotObservable(refreshNode, {
      '1': {
        id: 2,
        path: ',1,2,',
        pathNames: [
          { nodeId: 1, nodeUuid: '0615c304-e7ec-46ad-aebc-399884181eaf', name: 'Test' }
        ]
      }
    });
    const clearNodes$ = testScheduler.createHotObservable(clearNodes);
    const addNode$ = testScheduler.createHotObservable(addNode, {
      '1': { value: { id: 1 }, path: [] },
      '2': { value: { id: 2 }, path: [] }
    });
    const toggleNode$ = new Subject();
    const markObject$ = new Subject();
    const markMainObject$ = new Subject();
    const refreshMainObject$ = new Subject();
    const removeObject$ = testScheduler.createHotObservable(removeObject, {
      '1': { id: 1, museumNo: 'H1' }
    });
    const clearObjects$ = testScheduler.createHotObservable(clearObjects);
    const addObject$ = testScheduler.createHotObservable(addObject, {
      '1': { value: { id: 1 }, path: [] },
      '2': { value: { id: 2, uuid: 2 }, path: [] },
      '3': { value: { id: 3, uuid: 3 }, path: [] }
    });
    const toggleObject$ = new Subject();
    const adding$ = new Subject();

    const addObjects$ = testScheduler.createHotObservable(addObjects, {
      '1': [
        { marked: true, value: { id: 7, uuid: 7 }, path: [] },
        { marked: true, value: { id: 8, uuid: 8 }, path: [] },
        { marked: true, value: { id: 9, uuid: 9 }, path: [] }
      ]
    });

    const refreshObjects$ = testScheduler
      .createHotObservable(refreshObjects, {
        '1': { movableObjects: [{ id: 3 }], museumId: 99, token: '1224' },
        '2': { movableObjects: [{ id: 3 }, { id: 2 }], museumId: 99, token: '1224' }
      })
      .switchMap(
        MusitObject.getObjectLocations((url, data) => {
          if (isEqual(data, [{ id: 3 }])) {
            return Observable.of({
              response: [
                {
                  node: {
                    id: 1456,
                    path: ',3,',
                    pathNames: [
                      {
                        nodeId: 3,
                        nodeUuid: '403cebde-082c-4002-8f78-16ad178a054a',
                        name: 'test'
                      }
                    ],
                    objectId: 3
                  }
                }
              ]
            });
          }
          if (isEqual(data, [{ id: 3 }, { id: 2 }])) {
            return Observable.of({
              response: [
                {
                  node: {
                    id: 1456,
                    path: ',3,',
                    pathNames: [
                      {
                        nodeId: 3,
                        nodeUuid: '403cebde-082c-4002-8f78-16ad178a054a',
                        name: 'test'
                      }
                    ]
                  }
                }
              ]
            });
          }
          return Observable.empty();
        })
      );

    const state$ = store$({
      clearObjects$,
      removeObject$,
      markObject$,
      markMainObject$,
      addObject$,
      addObjects$,
      toggleObject$,
      adding$,
      clearNodes$,
      removeNode$,
      markNode$,
      addNode$,
      toggleNode$,
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
    id: 23,
    nodeId: '775b4163-acea-4237-a558-8b1e004b9813',
    name: 'q3',
    isPartOf: 2,
    groupRead: 'foo',
    path: ',2,23,',
    type: 'Organisation',
    updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    updatedDate: '2017-02-09T14:43:02+00:00',
    breadcrumb: [
      { id: 23, name: 'q3', url: '/magasin/23' },
      { id: 23, name: 'q3', url: '/magasin/23' }
    ]
  };

  const nodePickList = [
    {
      marked: false,
      value: {
        id: 21,
        nodeId: 'ab18d9be-a404-4147-8971-7514a53d0563',
        name: 'q1',
        isPartOf: 2,
        groupRead: 'foo',
        path: ',2,21,',
        type: 'Organisation',
        updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        updatedDate: '2017-02-09T14:42:43+00:00',
        breadcrumb: [
          { id: 21, name: 'q1', url: '/magasin/21' },
          { id: 21, name: 'q1', url: '/magasin/21' }
        ]
      },
      path: [{ id: 2, name: 'Utenfor museet', url: '/magasin/2' }]
    },
    {
      marked: false,
      value: {
        id: 22,
        nodeId: '6d57c513-0a22-4718-baa0-91aa8483d966',
        name: 'q2',
        isPartOf: 2,
        groupRead: 'foo',
        path: ',2,22,',
        type: 'Organisation',
        updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        updatedDate: '2017-02-09T14:42:53+00:00',
        breadcrumb: [
          { id: 22, name: 'q2', url: '/magasin/22' },
          { id: 22, name: 'q2', url: '/magasin/22' }
        ]
      },
      path: [{ id: 2, name: 'Utenfor museet', url: '/magasin/2' }]
    },
    {
      marked: false,
      value: {
        id: 23,
        nodeId: '775b4163-acea-4237-a558-8b1e004b9813',
        name: 'q3',
        isPartOf: 2,
        groupRead: 'foo',
        path: ',2,23,',
        type: 'Organisation',
        updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        updatedDate: '2017-02-09T14:43:02+00:00',
        breadcrumb: [
          { id: 23, name: 'q3', url: '/magasin/23' },
          { id: 23, name: 'q3', url: '/magasin/23' }
        ]
      },
      path: [{ id: 2, name: 'Utenfor museet', url: '/magasin/2' }]
    }
  ];

  it('Testing node in isItemAdded function', () => {
    expect(isItemAdded(node, nodePickList)).toBe(true);
  });

  const object = {
    id: 15,
    museumId: 99,
    museumNo: 'MusK24',
    subNo: 'a',
    term: 'Lendeklede'
  };

  const objectPickList = [
    {
      marked: false,
      value: { id: 15, museumId: 99, museumNo: 'MusK24', subNo: 'a', term: 'Lendeklede' },
      path: [{ id: 2, name: 'Utenfor museet', url: '/magasin/2' }]
    },
    {
      marked: false,
      value: { id: 16, museumId: 99, museumNo: 'MusK24', subNo: 'b', term: 'Kokekar' },
      path: [{ id: 2, name: 'Utenfor museet', url: '/magasin/2' }]
    },
    {
      marked: false,
      value: { id: 20, museumId: 99, museumNo: 'MusK33', term: 'Bronsjespenne' },
      path: [{ id: 2, name: 'Utenfor museet', url: '/magasin/2' }]
    },
    {
      marked: false,
      value: { id: 21, museumId: 99, museumNo: 'MusK34', subNo: 'a', term: 'Kniv' },
      path: [{ id: 2, name: 'Utenfor museet', url: '/magasin/2' }]
    },
    {
      marked: false,
      value: { id: 22, museumId: 99, museumNo: 'MusK34', subNo: 'b', term: 'Spydspiss' },
      path: [{ id: 2, name: 'Utenfor museet', url: '/magasin/2' }]
    }
  ];

  it('Testing object in isItemAdded function', () => {
    expect(isItemAdded(object, objectPickList)).toBe(true);
  });
});
