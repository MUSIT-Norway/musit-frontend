// @flow
import { onMount } from '../AnalysisViewContainer';
import sinon from 'sinon';
declare var describe: any;
declare var it: any;
declare var expect: any;
declare var fail: (msg: string) => void;

const LOADING = true;
const NOT_LOADING = false;

describe('analysisViewContainer', () => {
  it(
    'should load all predefined types if none is loading',
    runTest(
      NOT_LOADING,
      NOT_LOADING,
      (loadSampleTypesParams, loadAnalysisTypesParams) => {
        if (!loadSampleTypesParams) {
          return fail('Missing params for loading sample types');
        }
        if (!loadAnalysisTypesParams) {
          return fail('Missing params for loading analysis types');
        }
        expect(loadSampleTypesParams.museumId).toBe(99);
        expect(loadSampleTypesParams.token).toBe('1234');
        expect(loadSampleTypesParams.collectionId).toBe('12345');
        expect(loadAnalysisTypesParams.museumId).toBe(99);
        expect(loadAnalysisTypesParams.token).toBe('1234');
        expect(loadAnalysisTypesParams.collectionId).toBe('12345');
      }
    )
  );

  it(
    'should load only analysis types if sample types is loading',
    runTest(LOADING, NOT_LOADING, (loadSampleTypesParams, loadAnalysisTypesParams) => {
      expect(loadSampleTypesParams).toBe(null);
      if (!loadAnalysisTypesParams) {
        return fail('Missing params for loading analysis types');
      }
      expect(loadAnalysisTypesParams.museumId).toBe(99);
      expect(loadAnalysisTypesParams.token).toBe('1234');
      expect(loadAnalysisTypesParams.collectionId).toBe('12345');
    })
  );

  it(
    'should load only sample types if analysis types is loading',
    runTest(NOT_LOADING, LOADING, loadSampleTypesParams => {
      if (!loadSampleTypesParams) {
        return fail('Missing params for loading sample types');
      }
      expect(loadSampleTypesParams.museumId).toBe(99);
      expect(loadSampleTypesParams.token).toBe('1234');
      expect(loadSampleTypesParams.collectionId).toBe('12345');
    })
  );
});

type SubjectParams = { museumId: number, collectionId: string, token: string };

function runTest(
  loadingSampleTypes: boolean,
  loadingAnalysisTypes: boolean,
  assertFn: (sampleTypesArg: ?SubjectParams, analysisTypesArgs: ?SubjectParams) => void
) {
  return () => {
    const setLoadingSampleTypes = sinon.spy();
    const loadSampleTypes = sinon.spy();
    const setLoadingAnalysisTypes = sinon.spy();
    const loadAnalysisTypes = sinon.spy();
    const predefined = {
      loadingSampleTypes,
      loadingAnalysisTypes
    };
    const appSession = {
      museumId: 99,
      collectionId: '12345',
      accessToken: '1234'
    };
    onMount({
      setLoadingAnalysisTypes,
      loadAnalysisTypes,
      setLoadingSampleTypes,
      loadSampleTypes,
      predefined,
      appSession
    });

    expect(setLoadingSampleTypes.calledOnce).toBe(!loadingSampleTypes);
    expect(loadSampleTypes.calledOnce).toBe(!loadingSampleTypes);
    expect(setLoadingAnalysisTypes.calledOnce).toBe(!loadingAnalysisTypes);
    expect(loadAnalysisTypes.calledOnce).toBe(!loadingAnalysisTypes);
    assertFn(
      !loadingSampleTypes ? loadSampleTypes.getCall(0).args[0] : null,
      !loadingAnalysisTypes ? loadAnalysisTypes.getCall(0).args[0] : null
    );
  };
}
