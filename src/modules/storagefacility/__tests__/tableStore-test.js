import { Observable } from 'rxjs/Rx';
import { store$ } from '../tableStore';
import MusitNode from '../../../models/node';
import MusitObject from '../../../models/object';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

describe('tableStore', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();

    // mock streams
    const loadRootNodeM = '---------------1';
    const clearRootNodeM = '--x-------------';
    const loadObjectsM = '-----------1-2--';
    const loadStatsM = '----------1-----';
    const setLoadingM = '-x--------------';
    const loadNodesM = '------1--2------';
    const expected = 'abh---c--def-g-i';

    const expectedStateMap = {
      a: {},
      b: { children: { loading: true, data: null } },
      h: { children: { loading: true, data: null }, rootNode: null, stats: null },
      c: {
        children: {
          loading: false,
          data: {
            totalMatches: 1,
            matches: [{ name: 'en node 456', nodeId: 'uuid 456', id: 456 }]
          }
        },
        rootNode: null,
        stats: null
      },
      d: {
        children: {
          loading: false,
          data: {
            totalMatches: 2,
            matches: [
              { name: 'en node 56', nodeId: 'uuid 56', id: 56 },
              {
                name: 'en node 3',
                nodeId: 'uuid 3',
                id: 3
              }
            ]
          }
        },
        rootNode: null,
        stats: null
      },
      e: {
        children: {
          loading: false,
          data: {
            totalMatches: 2,
            matches: [
              { name: 'en node 56', nodeId: 'uuid 56', id: 56 },
              {
                name: 'en node 3',
                nodeId: 'uuid 3',
                id: 3
              }
            ]
          }
        },
        rootNode: null,
        stats: { numNodes: 1, numObjects: 4, totalObjects: 9 }
      },
      f: {
        children: {
          loading: false,
          data: {
            totalMatches: 1,
            matches: [{ name: 'ett objekt 456', nodeId: 'uuid 456', id: 456 }]
          }
        },
        rootNode: null,
        stats: { numNodes: 1, numObjects: 4, totalObjects: 9 }
      },
      g: {
        children: {
          loading: false,
          data: {
            totalMatches: 2,
            matches: [
              { name: 'ett objekt 56', nodeId: 'uuid 56', id: 56 },
              {
                name: 'ett objekt 3',
                nodeId: 'uuid 3',
                id: 3
              }
            ]
          }
        },
        rootNode: null,
        stats: { numNodes: 1, numObjects: 4, totalObjects: 9 }
      },
      i: {
        children: {
          loading: false,
          data: {
            totalMatches: 2,
            matches: [
              { name: 'ett objekt 56', nodeId: 'uuid 56', id: 56 },
              {
                name: 'ett objekt 3',
                nodeId: 'uuid 3',
                id: 3
              }
            ]
          }
        },
        rootNode: {
          name: 'en rootNode 457',
          nodeId: 'uuid 457',
          id: 457,
          breadcrumb: [],
          environmentRequirement: {},
          securityAssessment: {},
          environmentAssessment: {}
        },
        stats: { numNodes: 1, numObjects: 4, totalObjects: 9 }
      }
    };

    // mock up$ and down$ events
    const clearRootNode$ = testScheduler.createHotObservable(clearRootNodeM);
    const setLoading$ = testScheduler.createHotObservable(setLoadingM);
    const loadNodes$ = testScheduler
      .createHotObservable(loadNodesM, {
        1: { id: 1, museumId: 99, token: '1234' },
        2: { id: 2, museumId: 99, token: '1234' }
      })
      .switchMap(
        MusitNode.getNodes(url => {
          if (url.indexOf('1/children') > -1) {
            return Observable.of({
              response: {
                matches: [{ name: 'en node 456', nodeId: 'uuid 456', id: 456 }],
                totalMatches: 1
              }
            });
          }
          if (url.indexOf('2/children') > -1) {
            return Observable.of({
              response: {
                matches: [
                  { name: 'en node 56', nodeId: 'uuid 56', id: 56 },
                  { name: 'en node 3', nodeId: 'uuid 3', id: 3 }
                ],
                totalMatches: 2
              }
            });
          }
        })
      );
    const loadObjects$ = testScheduler
      .createHotObservable(loadObjectsM, {
        1: {
          id: 1,
          museumId: 99,
          collectionId: '1233',
          token: '1234'
        },
        2: {
          id: 2,
          museumId: 99,
          collectionId: '1233',
          token: '1234'
        }
      })
      .switchMap(
        MusitObject.getObjects(url => {
          if (url.indexOf('1/objects') > -1) {
            return Observable.of({
              response: {
                matches: [{ name: 'ett objekt 456', nodeId: 'uuid 456', id: 456 }],
                totalMatches: 1
              }
            });
          }
          if (url.indexOf('2/objects') > -1) {
            return Observable.of({
              response: {
                matches: [
                  { name: 'ett objekt 56', nodeId: 'uuid 56', id: 56 },
                  { name: 'ett objekt 3', nodeId: 'uuid 3', id: 3 }
                ],
                totalMatches: 2
              }
            });
          }
        })
      );
    const loadStats$ = testScheduler
      .createHotObservable(loadStatsM, {
        1: { id: 1, museumId: 99, token: '1234' }
      })
      .switchMap(
        MusitNode.getStats(() =>
          Observable.of({
            response: { numNodes: 1, numObjects: 4, totalObjects: 9 }
          })
        )
      );
    const loadRootNode$ = testScheduler
      .createHotObservable(loadRootNodeM, {
        1: { id: 1, museumId: 99, token: '1234' }
      })
      .switchMap(
        MusitNode.getNode(() =>
          Observable.of({
            response: { name: 'en rootNode 457', nodeId: 'uuid 457', id: 457 }
          })
        )
      );

    const state$ = store$({
      clearRootNode$,
      setLoading$,
      loadNodes$,
      loadObjects$,
      loadStats$,
      loadRootNode$
    });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
