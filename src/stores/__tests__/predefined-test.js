// @flow
import { Observable } from 'rxjs/Rx';
import { store$ } from '../predefined';
import Sample from '../../models/sample';
import Analysis from '../../models/analysis';
import Conservation from '../../models/conservation';
import MusitTestScheduler from '../../testutils/MusitTestScheduler';

describe('predefined', () => {
  it('should load types', () => {
    const testScheduler = new MusitTestScheduler();

    // mock streams
    // prettier-ignore
    const stream = {
      setLoadingSampleTypesM:       '-1-------',
      loadSampleTypesM:             '--1------',
      setLoadingAnalysisTypesM:     '---1-----',
      loadAnalysisTypesM:           '----1----',
      setLoadingConservationTypesM: '-----1---',
      loadConservationTypesM:       '------1--',
      expected:                     'abcdefg--'
    };

    const expectedStateMap = {
      a: {
        analysisLabList: null,
        categories: null,
        sampleTypes: null,
        analysisTypes: null,
        conservationTypes: null,
        purposes: null,
        storageContainers: null,
        storageMediums: null,
        treatments: null,
        loadingAnalysisTypes: false,
        loadingSampleTypes: false,
        loadingConservationTypes: false
      },
      b: {
        analysisLabList: null,
        categories: null,
        sampleTypes: null,
        analysisTypes: null,
        conservationTypes: null,
        purposes: null,
        storageContainers: null,
        storageMediums: null,
        treatments: null,
        loadingAnalysisTypes: false,
        loadingSampleTypes: true,
        loadingConservationTypes: false
      },
      c: {
        analysisLabList: null,
        categories: null,
        analysisTypes: null,
        conservationTypes: null,
        purposes: null,
        loadingAnalysisTypes: false,
        loadingSampleTypes: false,
        loadingConservationTypes: false,
        sampleTypes: { raw: [] },
        storageContainers: [],
        storageMediums: [],
        treatments: []
      },
      d: {
        analysisLabList: null,
        categories: null,
        analysisTypes: null,
        conservationTypes: null,
        purposes: null,
        loadingAnalysisTypes: true,
        loadingSampleTypes: false,
        loadingConservationTypes: false,
        sampleTypes: { raw: [] },
        storageContainers: [],
        storageMediums: [],
        treatments: []
      },
      e: {
        conservationTypes: null,
        loadingAnalysisTypes: false,
        loadingSampleTypes: false,
        loadingConservationTypes: false,
        sampleTypes: { raw: [] },
        storageContainers: [],
        storageMediums: [],
        treatments: [],
        analysisTypes: [],
        categories: {
          raw: []
        },
        purposes: [],
        analysisLabList: []
      },
      f: {
        conservationTypes: null,
        loadingAnalysisTypes: false,
        loadingSampleTypes: false,
        loadingConservationTypes: true,
        sampleTypes: { raw: [] },
        storageContainers: [],
        storageMediums: [],
        treatments: [],
        analysisTypes: [],
        categories: {
          raw: []
        },
        purposes: [],
        analysisLabList: []
      },
      g: {
        loadingAnalysisTypes: false,
        loadingSampleTypes: false,
        loadingConservationTypes: false,
        sampleTypes: { raw: [] },
        storageContainers: [],
        storageMediums: [],
        treatments: [],
        analysisTypes: [],
        categories: {
          raw: []
        },
        purposes: [],
        analysisLabList: [],
        conservationTypes: [
          {
            id: 1,
            noName: 'konserveringsprosess',
            enName: 'conservation process',
            collections: []
          },
          {
            id: 2,
            noName: 'behandling',
            enName: 'treatment',
            collections: ['ba3d4d30-810b-4c07-81b3-37751f2196f0']
          },
          {
            id: 3,
            noName: 'teknisk beskrivelse',
            enName: 'technical description',
            collections: []
          }
        ]
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

    const setLoadingConservationTypes$ = testScheduler.createHotObservable(
      stream.setLoadingConservationTypesM
    );
    const loadConservationTypes$ = testScheduler
      .createHotObservable(stream.loadConservationTypesM, {
        [1]: { token: '12134', museumId: 99 }
      })
      .flatMap(
        Conservation.getConservationTypes(() => {
          return Observable.of({
            response: [
              {
                id: 1,
                noName: 'konserveringsprosess',
                enName: 'conservation process',
                collections: []
              },
              {
                id: 2,
                noName: 'behandling',
                enName: 'treatment',
                collections: ['ba3d4d30-810b-4c07-81b3-37751f2196f0']
              },
              {
                id: 3,
                noName: 'teknisk beskrivelse',
                enName: 'technical description',
                collections: []
              }
            ]
          });
        })
      );
    const state$ = store$({
      setLoadingSampleTypes$,
      setLoadingAnalysisTypes$,
      loadAnalysisTypes$,
      loadSampleTypes$,
      setLoadingConservationTypes$,
      loadConservationTypes$
    });

    // assertion
    testScheduler.expectObservable(state$).toBe(stream.expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
