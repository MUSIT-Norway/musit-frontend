import { TestScheduler, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { store$, initialState } from '../moveDialogStore';
import MuseumId from '../../../models/museumId';
import MusitNode from '../../../models/node';

const diff = require('deep-diff').diff;

describe('moveDialog', () => {

  it('testing reducer', () => {
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
    const setPageM          = '-----12-----';
    const setLoadingM       = '--1---------';
    const clearM            = '-1----------';
    const loadNodeM         = '---1--------';
    const loadChildrenM     = '----1-------';
    const expected          = 'aadbcef-----';

    const expectedStateMap = {
      a: initialState,
      b: {
        ...initialState,
        selectedNode: {
          id: 1234,
          name: 'Test',
          type: 'Room',
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {},
          breadcrumb: []
        },
        data: { 
          ...initialState.data,
          loading: true
        }
      },
      c: {
        ...initialState,
        selectedNode: {
          id: 1234,
          name: 'Test',
          type: 'Room',
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {},
          breadcrumb: []
        }, data: {
          matches: [],
          loading: false
        }
      },
      d: { ...initialState, data: { ...initialState.data, loading: true } },
      e: {
        ...initialState,
        page: 1,
        selectedNode: {
          id: 1234,
          name: 'Test',
          type: 'Room',
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {},
          breadcrumb: []
        }, data: {
          matches: [],
          loading: false
        }
      },
      f: {
        ...initialState,
        page: 2,
        selectedNode: {
          id: 1234,
          name: 'Test',
          type: 'Room',
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {},
          breadcrumb: []
        }, data: {
          matches: [],
          loading: false
        }
      }
    };

    // mock up$ and down$ events
    const setLoading$ = testScheduler.createHotObservable(setLoadingM, { 1: true });
    const setPage$ = testScheduler.createHotObservable(setPageM, { 1: 1, 2: 2 });
    const clear$ = testScheduler.createHotObservable(clearM);
    const loadNode$ = testScheduler.createHotObservable(loadNodeM, { 1: { id: 1234, token: '1234', museumId: new MuseumId(99)}})
      .switchMap(MusitNode.getNode(
        () => Observable.of({
          response: {
            id: 1234,
            name: 'Test',
            type: 'Room'
          }
        })
      ));
    const loadChildren$ = testScheduler.createHotObservable(loadChildrenM, { 1: { id: 1234, token: '1234', museumId: new MuseumId(99) }})
      .switchMap(MusitNode.getNodes(
        () => Observable.of({
          response: {
            matches: [],
            totalMatches: 0
          }
        })
      ));

    const state$ = store$({clear$, loadNode$, loadChildren$, setLoading$, setPage$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});