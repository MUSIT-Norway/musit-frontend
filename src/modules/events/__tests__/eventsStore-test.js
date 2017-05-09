import { eventsStore$ } from '../eventsStore';
import MusitTestScheduler from 'testutils/MusitTestScheduler';

describe('eventsStore', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();
    const object = {
      id: 1,
      term: 'Fugl'
    };

    const currentLocation = {
      id: 1,
      name: 'Node'
    };

    // mock streams
    const clearM = '-1---------';
    const getCurrentLocM = '----1------';
    const setObjectM = '--1--------';
    const loadAnalysesM = '---1-------';
    const expected = 'aabcd------';

    const expectedStateMap = {
      a: {},
      b: {
        object
      },
      c: {
        object,
        data: []
      },
      d: {
        object,
        data: [],
        currentLocation
      }
    };

    // mock up$ and down$ events
    const clear$ = testScheduler.createHotObservable(clearM);
    const getCurrentLocation$ = testScheduler.createHotObservable(getCurrentLocM, {
      1: currentLocation
    });
    const setObject$ = testScheduler.createHotObservable(setObjectM, { 1: object });
    const loadEvents$ = testScheduler.createHotObservable(loadAnalysesM, { 1: [] });

    const state$ = eventsStore$({ clear$, getCurrentLocation$, setObject$, loadEvents$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
