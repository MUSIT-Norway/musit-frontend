import { onMount } from '../AnalysisEditContainer';
import sinon from 'sinon';

describe('analysisEditContainer', () => {
  it('should have working onMount', () => {
    const loadPredefinedTypes = sinon.spy();
    let callLoadAnalysisArgs = null;
    const getAnalysis = args => {
      callLoadAnalysisArgs = args;
      return new Promise(res => res({}));
    };
    const params = sinon.spy();
    const loadForm = sinon.spy();
    const appSession = {
      museumId: 99,
      collectionId: '00000000-0000-0000-0000-000000000000',
      accessToken: '1234'
    };
    onMount({
      loadPredefinedTypes,
      getAnalysis,
      appSession,
      params,
      loadForm
    });
    expect(loadPredefinedTypes.calledOnce).toBe(true);
    expect(loadForm.calledOnce).toBe(false);
  });
});
