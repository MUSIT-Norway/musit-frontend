import { sampleStore$ } from '../sampleStore';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

describe('eventsStore', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();

    // mock streams
    // prettier-ignore
    const clearM               = '-1---------';
    // prettier-ignore
    const loadPredefinedTypesM = '---1-------';
    // prettier-ignore
    const getSampleTypesM      = '--1--------';
    // prettier-ignore
    const getSampleM           = '-----------';
    // prettier-ignore
    const getSamplesForNodeM   = '-----------';
    // prettier-ignore
    const expected             = 'aabc-------';

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
    const getSamplesForNode$ = testScheduler.createHotObservable(getSamplesForNodeM);

    const state$ = sampleStore$({
      clear$,
      getPredefinedTypes$,
      getSampleTypes$,
      getSample$,
      getSamplesForNode$
    });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
