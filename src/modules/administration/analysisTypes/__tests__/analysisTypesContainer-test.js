import { onMount } from '../analysisTypesContainer';
import sinon from 'sinon';

describe('analysisTypesContainer', () => {
  it('should have working onMount', () => {
    const loadAnalysisTypes = sinon.spy();
    const getAnalysisTypes = sinon.spy();
    const appSession = {
      museumId: 99,
      collectionId: '45555',
      accessToken: '1234'
    };
    onMount({ loadAnalysisTypes, getAnalysisTypes, appSession });
    expect(loadAnalysisTypes.calledOnce).toBe(false);
    expect(getAnalysisTypes.calledOnce).toBe(true);
    expect(getAnalysisTypes.getCall(0).args[0].token).toEqual('1234');
    expect(getAnalysisTypes.getCall(0).args[0].museumId).toEqual(99);
  });
});
