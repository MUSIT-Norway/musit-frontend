import { onMount } from '../AnalysisViewContainer';
import sinon from 'sinon';

describe('analysisViewContainer', () => {
  it('should have working onMount', () => {
    const loadAnalysis = sinon.spy();
    const getAnalysisTypesForCollection = sinon.spy();
    const params = sinon.spy();
    const appSession = {
      museumId: 99,
      collectionId: '12345',
      accessToken: '1234'
    };
    onMount({ getAnalysisTypesForCollection, appSession, loadAnalysis, params });
    expect(loadAnalysis.calledOnce).toBe(true);
    expect(loadAnalysis.getCall(0).args[0].token).toEqual('1234');
    expect(loadAnalysis.getCall(0).args[0].museumId).toEqual(99);
    expect(loadAnalysis.getCall(0).args[0].collectionId).toEqual('12345');
  });
});
