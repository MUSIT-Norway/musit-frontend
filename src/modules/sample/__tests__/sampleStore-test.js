import { sampleStore$ } from '../sampleStore';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

describe('eventsStore', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();

    // mock streams
    // prettier-ignore
    const streams = {
      clearM:               '-1---------',
      loadPredefinedTypesM: '---1-------',
      getSampleTypesM:      '--1--------',
      getSampleM:           '-----------',
      getSamplesForNodeM:   '-----------',
      expected:             'aabc-------'
    };
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
    const clear$ = testScheduler.createHotObservable(streams.clearM);
    const getSample$ = testScheduler.createHotObservable(streams.getSampleM);
    const getPredefinedTypes$ = testScheduler.createHotObservable(
      streams.loadPredefinedTypesM,
      {
        1: {
          storageContainers: [],
          storageMediums: [],
          treatments: [],
          sampleTypes: []
        }
      }
    );
    const getSampleTypes$ = testScheduler.createHotObservable(streams.getSampleTypesM, {
      1: ['dummySampleTypes']
    });
    const getSamplesForNode$ = testScheduler.createHotObservable(
      streams.getSamplesForNodeM
    );

    const state$ = sampleStore$({
      clear$,
      getPredefinedTypes$,
      getSampleTypes$,
      getSample$,
      getSamplesForNode$
    });

    // assertion
    testScheduler.expectObservable(state$).toBe(streams.expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
