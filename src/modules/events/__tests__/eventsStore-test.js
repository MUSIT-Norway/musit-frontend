import { eventsStore$ } from '../eventsStore';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

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
    // prettier-ignore
    const mockStreams = {
      getCurrentLocM: '--1--------',
      setObjectM:     '-1---------',
      expected:       'oab--------'
    };

    const expectedStateMap = {
      o: {},
      a: {
        object
      },
      b: {
        object,
        currentLocation
      }
    };

    // mock up$ and down$ events
    const getCurrentLocation$ = testScheduler.createHotObservable(
      mockStreams.getCurrentLocM,
      {
        1: currentLocation
      }
    );
    const setObject$ = testScheduler.createHotObservable(mockStreams.setObjectM, {
      1: object
    });

    const state$ = eventsStore$({ getCurrentLocation$, setObject$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(mockStreams.expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
