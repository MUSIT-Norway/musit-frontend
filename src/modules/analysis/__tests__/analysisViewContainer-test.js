import { onMount } from '../AnalysisViewContainer';
import sinon from 'sinon';

describe('analysisViewContainer', () => {
  it('should have working onMount', () => {
    let callLoadAnalysisArgs = null;
    const loadAnalysis = args => {
      callLoadAnalysisArgs = args;
      return new Promise(res => res({}));
    };
    const getAnalysisTypes = sinon.spy();
    const loadForm = sinon.spy();
    const params = sinon.spy();
    const appSession = {
      museumId: 99,
      collectionId: '12345',
      accessToken: '1234'
    };
    onMount({ getAnalysisTypes, appSession, loadForm, loadAnalysis, params });
    expect(callLoadAnalysisArgs).toEqual({
      museumId: 99,
      collectionId: '12345',
      token: '1234'
    });
  });
});
