/* eslint-disable */
import { Subject, Observable } from 'rxjs/Rx';
import { store$ } from '../predefined';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import Analysis from '../../models/analysis';
import isEqual from 'lodash/isEqual';
import MusitTestScheduler from '../../testutils/MusitTestScheduler';

const diff = require('deep-diff').diff;

describe('predefined', () => {
  it('should load types', () => {
    const testScheduler = new MusitTestScheduler();

    // mock streams
    const setLoadingSampleTypesM = '-1-------';
    const loadSampleTypesM = '--1------';
    const setLoadingAnalysisTypesM = '---1-----';
    const loadAnalysisTypesM = '----1----';
    const expected = 'abcde----';

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
        sampleTypes: {},
        storageContainers: [],
        storageMediums: [],
        treatments: []
      },
      d: {
        loadingAnalysisTypes: true,
        loadingSampleTypes: false,
        sampleTypes: {},
        storageContainers: [],
        storageMediums: [],
        treatments: []
      },
      e: {
        loadingAnalysisTypes: false,
        loadingSampleTypes: false,
        sampleTypes: {},
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
      setLoadingSampleTypesM
    );
    const loadSampleTypes$ = testScheduler
      .createHotObservable(loadSampleTypesM, {
        1: { token: '12134', museumId: 99, collectionId: 'sfsfdfs' }
      })
      .flatMap(
        Sample.loadPredefinedTypes(() => {
          return Observable.of({
            response: []
          });
        })
      );
    const setLoadingAnalysisTypes$ = testScheduler.createHotObservable(
      setLoadingAnalysisTypesM
    );
    const loadAnalysisTypes$ = testScheduler
      .createHotObservable(loadAnalysisTypesM, {
        1: { token: '12134', museumId: 99, collectionId: 'sfsfdfs' }
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
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
