import { onMount } from '../analysisEditContainer';
import sinon from 'sinon';
import { Observable } from 'rxjs';

describe('analysisEditContainer', () => {
  it('should have working onMount', () => {
    const getAnalysisTypesForCollection = sinon.spy();
    const loadAnalysis = sinon.spy();
    const params = sinon.spy();
    const loadForm = sinon.spy();
    const appSession = {
      museumId: 99,
      collectionId: '00000000-0000-0000-0000-000000000000',
      accessToken: '1234'
    };
    const loadAnalysisForForm = () => Observable.of({ objectId: '123' }).toPromise();
    onMount({
      getAnalysisTypesForCollection,
      loadAnalysisForForm,
      loadAnalysis,
      appSession,
      params,
      loadForm
    });
    expect(loadAnalysis.calledOnce).toBe(true);
    expect(loadForm.calledOnce).toBe(false);
    expect(loadAnalysis.getCall(0).args[0].token).toEqual('1234');
    expect(loadAnalysis.getCall(0).args[0].museumId).toEqual(99);
    expect(loadAnalysis.getCall(0).args[0].collectionId).toEqual(
      '00000000-0000-0000-0000-000000000000'
    );
  });
});
