import { onMount } from '../AnalysisEditContainer';
import sinon from 'sinon';
import { Observable } from 'rxjs';

describe('analysisEditContainer', () => {
  it('should have working onMount', () => {
    const getAnalysisTypes = sinon.spy();
    let callLoadAnalysisArgs = null;
    const loadAnalysis = (args) => {
      callLoadAnalysisArgs = args;
      return new Promise((res) => res({}));
    };
    const params = sinon.spy();
    const loadForm = sinon.spy();
    const appSession = {
      museumId: 99,
      collectionId: '00000000-0000-0000-0000-000000000000',
      accessToken: '1234'
    };
    const loadAnalysisForForm = () => Observable.of({ objectId: '123' }).toPromise();
    onMount({
      getAnalysisTypes,
      loadAnalysisForForm,
      loadAnalysis,
      appSession,
      params,
      loadForm
    });
    expect(getAnalysisTypes.calledOnce).toBe(true);
    expect(loadForm.calledOnce).toBe(false);
    expect(callLoadAnalysisArgs).toEqual({
      museumId:99,
      collectionId:'00000000-0000-0000-0000-000000000000',
      token:'1234'
    });
  });
});
