import { onMount } from '../analysisEditContainer';
import sinon from 'sinon';
import { AppSession } from '../../app/appSession';
import MuseumId from '../../../models/museumId';
import CollectdionId from '../../../models/collectionId';
import { Observable } from 'rxjs';

describe('analysisEditContainer', () => {
  it('should have working onMount', () => {
    const getAnalysisTypesForCollection = sinon.spy();
    const loadAnalysis = sinon.spy();
    const params = sinon.spy();
    const loadForm = sinon.spy();
    const appSession = new AppSession({
      museumId: new MuseumId(99),
      collectionId: new CollectdionId('00000000-0000-0000-0000-000000000000'),
      accessToken: '1234'
    });
    const loadAnalysisForForm = () => Observable.of({ objectId: '123' });
    onMount({
      getAnalysisTypesForCollection,
      loadAnalysisForForm,
      loadAnalysis,
      appSession,
      params,
      loadForm
    });
    expect(loadAnalysis.calledOnce).toBe(true);
    expect(loadForm.calledOnce).toBe(true);
    expect(loadForm.getCall(0).args[0]).toEqual([
      { name: 'objectId', defaultValue: '123' }
    ]);
    expect(loadAnalysis.getCall(0).args[0].token).toEqual('1234');
    expect(loadAnalysis.getCall(0).args[0].museumId).toEqual(new MuseumId(99));
    expect(loadAnalysis.getCall(0).args[0].collectionId).toEqual(
      new CollectdionId('00000000-0000-0000-0000-000000000000')
    );
  });
});
