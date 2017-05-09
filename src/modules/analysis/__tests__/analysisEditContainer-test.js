import { onMount } from '../AnalysisEditContainer';
import sinon from 'sinon';
import { Observable } from 'rxjs';

describe('analysisEditContainer', () => {
  it('should have working onMount', () => {
    const getAnalysisTypes = sinon.spy();
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
    const loadAnalysisForForm = () => Observable.of({ objectId: '123' }).toPromise();
    onMount({
      getAnalysisTypes,
      loadAnalysisForForm,
      getAnalysis,
      appSession,
      params,
      loadForm
    });
    expect(getAnalysisTypes.calledOnce).toBe(true);
    expect(loadForm.calledOnce).toBe(false);
    expect(callLoadAnalysisArgs.museumId).toEqual(99);
    expect(callLoadAnalysisArgs.collectionId).toEqual(
      '00000000-0000-0000-0000-000000000000'
    );
    expect(callLoadAnalysisArgs.token).toEqual('1234');
  });
});
