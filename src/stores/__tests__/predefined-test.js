// @flow
import { Observable } from 'rxjs/Rx';
import { store$ } from '../predefined';
import Sample from '../../models/sample';
import Analysis from '../../models/analysis';
import MusitTestScheduler from '../../testutils/MusitTestScheduler';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('predefined', () => {
  it('should load types', () => {
    const testScheduler = new MusitTestScheduler();

    // mock streams
    // prettier-ignore
    const stream = {
      setLoadingSampleTypesM:   '-1-------',
      loadSampleTypesM:         '--1------',
      setLoadingAnalysisTypesM: '---1-----',
      loadAnalysisTypesM:       '----1----',
      expected:                 'abcde----'
    };

    const expectedStateMap = {
      a: {
        loadingAnalysisTypes: false,
        loadingSampleTypes: false
      },
      b: {
        loadingAnalysisTypes: false,
        loadingSampleTypes: true
      },
      c: {
        loadingAnalysisTypes: false,
        loadingSampleTypes: false,
        sampleTypes: { raw: [] },
        storageContainers: [],
        storageMediums: [],
        treatments: []
      },
      d: {
        loadingAnalysisTypes: true,
        loadingSampleTypes: false,
        sampleTypes: { raw: [] },
        storageContainers: [],
        storageMediums: [],
        treatments: []
      },
      e: {
        loadingAnalysisTypes: false,
        loadingSampleTypes: false,
        sampleTypes: { raw: [] },
        storageContainers: [],
        storageMediums: [],
        treatments: [],
        analysisTypes: [],
        categories: {},
        purposes: [],
        analysisLabList: []
      }
    };

    const setLoadingSampleTypes$ = testScheduler.createHotObservable(
      stream.setLoadingSampleTypesM
    );

    const loadSampleTypes$ = testScheduler
      .createHotObservable(stream.loadSampleTypesM, {
        [1]: { token: '12134', museumId: 99, collectionId: 'sfsfdfs' }
      })
      .flatMap(
        Sample.loadPredefinedTypes(() => {
          return Observable.of({
            response: []
          });
        })
      );

    const setLoadingAnalysisTypes$ = testScheduler.createHotObservable(
      stream.setLoadingAnalysisTypesM
    );

    const loadAnalysisTypes$ = testScheduler
      .createHotObservable(stream.loadAnalysisTypesM, {
        [1]: { token: '12134', museumId: 99 }
      })
      .flatMap(
        Analysis.loadPredefinedTypes(() => {
          return Observable.of({
            response: []
          });
        })
      );

    const state$ = store$({
      setLoadingSampleTypes$,
      setLoadingAnalysisTypes$,
      loadAnalysisTypes$,
      loadSampleTypes$
    });

    // assertion
    testScheduler.expectObservable(state$).toBe(stream.expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
