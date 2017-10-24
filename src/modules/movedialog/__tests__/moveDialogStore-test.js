import { Observable } from 'rxjs';
import { initialState, store$ } from '../moveDialogStore';
import MusitNode from '../../../models/node';

import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

describe('moveDialog', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();
    // mock streams
    const setPageM = '-----12-----';
    const setLoadingM = '--1---------';
    const clearM = '-1----------';
    const loadNodeM = '---1--------';
    const loadChildrenM = '----1-------';
    const expected = 'aadbcef-----';

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
        },
        data: {
          matches: [],
          loading: false
        }
      },
      d: { ...initialState, data: { ...initialState.data, loading: true } },
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
        },
        data: {
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
        },
        data: {
          matches: [],
          loading: false
        }
      }
    };

    // mock up$ and down$ events
    const setLoading$ = testScheduler.createHotObservable(setLoadingM, { 1: true });
    const setPage$ = testScheduler.createHotObservable(setPageM, { 1: 1, 2: 2 });
    const clear$ = testScheduler.createHotObservable(clearM);
    const loadNode$ = testScheduler
      .createHotObservable(loadNodeM, {
        1: { id: 1234, token: '1234', museumId: 99 }
      })
      .switchMap(
        MusitNode.getNode(() =>
          Observable.of({
            response: {
              id: 1234,
              name: 'Test',
              type: 'Room'
            }
          })
        )
      );
    const loadChildren$ = testScheduler
      .createHotObservable(loadChildrenM, {
        1: { id: 1234, token: '1234', museumId: 99 }
      })
      .switchMap(
        MusitNode.getNodes(() =>
          Observable.of({
            response: {
              matches: [],
              totalMatches: 0
            }
          })
        )
      );

    const state$ = store$({ clear$, loadNode$, loadChildren$, setLoading$, setPage$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
