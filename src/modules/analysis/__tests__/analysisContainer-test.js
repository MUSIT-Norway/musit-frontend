import { onMount } from '../AnalysisAddContainer';
import sinon from 'sinon';

describe('analysisContainer', () => {
  it('should have working onMount', () => {
    const loadAnalysisTypes = sinon.spy();
    const getAnalysisTypesForCollection = sinon.spy();
    const appSession = {
      museumId: 99,
      collectionId: '45555',
      accessToken: '1234'
    };
    onMount({ loadAnalysisTypes, getAnalysisTypesForCollection, appSession });
    expect(loadAnalysisTypes.calledOnce).toBe(true);
    expect(loadAnalysisTypes.getCall(0).args[0].token).toEqual('1234');
    expect(loadAnalysisTypes.getCall(0).args[0].museumId).toEqual(99);
  });
});
