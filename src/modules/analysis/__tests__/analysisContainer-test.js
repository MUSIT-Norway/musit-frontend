import { onMount } from '../AnalysisAddContainer';
import sinon from 'sinon';

describe('analysisContainer', () => {
  it('should have working onMount', () => {
    const loadPredefinedTypes = sinon.spy();
    const appSession = {
      museumId: 99,
      collectionId: '45555',
      accessToken: '1234'
    };
    onMount({ loadPredefinedTypes,  appSession });
    expect(loadPredefinedTypes.calledOnce).toBe(true);
    expect(loadPredefinedTypes.getCall(0).args[0].token).toEqual('1234');
    expect(loadPredefinedTypes.getCall(0).args[0].museumId).toEqual(99);
  });
});