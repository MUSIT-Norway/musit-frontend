import { onMount } from '../analysisEditContainer';
import sinon from 'sinon';
import { AppSession } from '../../app/appSession';
import MuseumId from '../../../models/museumId';
import CollectdionId from '../../../models/collectionId';

describe('analysisEditContainer', () => {
  it('should have working onMount', () => {
    const getAnalysisTypesForCollection = sinon.spy();
    const loadAnalysis = sinon.spy();
    const params = sinon.spy();
    const appSession = new AppSession({
      museumId: new MuseumId(99),
      collectionId: new CollectdionId('00000000-0000-0000-0000-000000000000'),
      accessToken: '1234' });
    onMount({ getAnalysisTypesForCollection, loadAnalysis, appSession, params });
    expect(getAnalysisTypesForCollection.calledOnce).toBe(true);
    expect(getAnalysisTypesForCollection.getCall(0).args[0].token).toEqual('1234');
    expect(getAnalysisTypesForCollection.getCall(0).args[0].museumId).toEqual(new MuseumId(99));
    expect(getAnalysisTypesForCollection.getCall(0).args[0].collectionId)
      .toEqual(new CollectdionId('00000000-0000-0000-0000-000000000000'));
  });
});
