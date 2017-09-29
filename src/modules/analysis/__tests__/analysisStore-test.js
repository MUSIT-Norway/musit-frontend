// @flow
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';
import { store$, initialState } from '../analysisStore';
import { Observable } from 'rxjs';
import { appSession } from '../../../testutils/sampleDataForTest';
import Config from '../../../config';

const getAnalysisByIdUrl = Config.magasin.urls.api.analysis.getAnalysisById;

describe('analysisStore', () => {
  it('should merge store results', () => {
    const testScheduler = new MusitTestScheduler();
    //prettier-ignore
    const streams = {
      clearStore:                      "-x-----",
      getAnalysis:                     "--ab---",
      getAnalysisTypes:                "-------",
      loadPredefinedTypes:             "-------",
      saveAnalysis:                    "-------",
      setLoading:                      "-------",
      toggleCancelDialog:              "-------",
      updateAnalysis:                  "-------",
      updateExtraDescriptionAttribute: "-------",
      updateExtraResultAttribute:      "-------",
      updateRestriction:               "-------",
      expected:                        "aaab---"
    };

    const clearStore$ = testScheduler.createHotObservable(streams.clearStore);
    const getAnalysis$ = testScheduler.createHotObservable(streams.getAnalysis, {
      a: {
        id: -1,
        museumId: appSession.museumId,
        collectionId: appSession.collectionId,
        token: appSession.accessToken
      },
      b: {
        id: 1,
        museumId: appSession.museumId,
        collectionId: appSession.collectionId,
        token: appSession.accessToken
      }
    });
    const getAnalysisTypes$ = testScheduler.createHotObservable(streams.getAnalysisTypes);
    const loadPredefinedTypes$ = testScheduler.createHotObservable(
      streams.loadPredefinedTypes
    );
    const saveAnalysis$ = testScheduler.createHotObservable(streams.saveAnalysis);
    const setLoading$ = testScheduler.createHotObservable(streams.setLoading);
    const toggleCancelDialog$ = testScheduler.createHotObservable(
      streams.toggleCancelDialog
    );
    const updateAnalysis$ = testScheduler.createHotObservable(streams.updateAnalysis);
    const updateExtraDescriptionAttribute$ = testScheduler.createHotObservable(
      streams.updateExtraDescriptionAttribute
    );
    const updateExtraResultAttribute$ = testScheduler.createHotObservable(
      streams.updateExtraResultAttribute
    );
    const updateRestriction$ = testScheduler.createHotObservable(
      streams.updateRestriction
    );

    const getFn = url => {
      if (url === getAnalysisByIdUrl(appSession.museumId, -1)) {
        return Observable.of({
          response: null
        });
      }
      if (url === getAnalysisByIdUrl(appSession.museumId, 1)) {
        return Observable.of({
          response: {
            mimbo: 'jimbo'
          }
        });
      }
      return Observable.of({});
    };

    const postFn = () => {
      return Observable.of({
        response: null
      });
    };

    const putFn = () => {
      return Observable.of({
        response: null
      });
    };

    const actions = {
      clearStore$,
      getAnalysis$,
      getAnalysisTypes$,
      loadPredefinedTypes$,
      saveAnalysis$,
      setLoading$,
      toggleCancelDialog$,
      updateAnalysis$,
      updateExtraDescriptionAttribute$,
      updateExtraResultAttribute$,
      updateRestriction$
    };

    const state$ = store$(actions, getFn, postFn, putFn);

    const expectedStateMap = {
      a: initialState,
      b: {
        ...initialState,
        analysis: {
          mimbo: 'jimbo'
        }
      }
    };

    testScheduler.expectObservable(state$).toBe(streams.expected, expectedStateMap);
    testScheduler.flush();
  });
});
