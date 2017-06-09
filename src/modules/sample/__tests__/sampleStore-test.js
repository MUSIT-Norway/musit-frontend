import { sampleStore$ } from '../sampleStore';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

describe('eventsStore', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();

    // mock streams
    const clearM = '-1---------';
    const loadPredefinedTypesM = '---1-----';
    const getSampleTypesM = '--1---------';
    const getSampleM = '-----------';
    const expected = 'aabc-------';

    const expectedStateMap = {
      a: {
        data: []
      },
      b: {
        data: [],
        sampleTypes: ['dummySampleTypes']
      },
      c: {
        data: [],
        storageContainers: [],
        storageMediums: [],
        treatments: [],
        sampleTypes: []
      }
    };

    // mock up$ and down$ events
    const clear$ = testScheduler.createHotObservable(clearM);
    const getSample$ = testScheduler.createHotObservable(getSampleM);
    const getPredefinedTypes$ = testScheduler.createHotObservable(loadPredefinedTypesM, {
      1: {
        storageContainers: [],
        storageMediums: [],
        treatments: [],
        sampleTypes: []
      }
    });
    const getSampleTypes$ = testScheduler.createHotObservable(getSampleTypesM, {
      1: ['dummySampleTypes']
    });

    const state$ = sampleStore$({
      clear$,
      getPredefinedTypes$,
      getSampleTypes$,
      getSample$
    });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
