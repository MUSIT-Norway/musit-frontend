import { onMount } from '../AnalysisViewContainer';
import sinon from 'sinon';

describe('analysisViewContainer', () => {
  it('should have working onMount', () => {
    const loadPredefinedTypes = sinon.spy();
    const loadForm = sinon.spy();
    const loadAnalysis = sinon.spy();
    const params = sinon.spy();
    const appSession = {
      museumId: 99,
      collectionId: '12345',
      accessToken: '1234'
    };
    onMount({ loadPredefinedTypes, appSession, loadForm, loadAnalysis, params });

    expect(loadPredefinedTypes.calledOnce).toBe(true);
    expect(loadPredefinedTypes.calledWith(sinon.match('museumId', 99)));
    expect(loadPredefinedTypes.calledWith(sinon.match('collectionId', 99))).toBe(false);
  });
});
