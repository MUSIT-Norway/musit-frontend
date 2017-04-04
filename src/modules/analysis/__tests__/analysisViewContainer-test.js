import { onMount } from '../analysisViewContainer';
import sinon from 'sinon';
import { AppSession } from '../../app/appSession';
import MuseumId from '../../../models/museumId';
import CollectionId from '../../../models/collectionId';

describe('analysisViewContainer', () => {
  it('should have working onMount', () => {
    const loadAnalysis = sinon.spy();
    const getAnalysisTypesForCollection = sinon.spy();
    const params = sinon.spy();
    const appSession = new AppSession({ museumId: new MuseumId(99), collectionId: new CollectionId(99), accessToken: '1234' });
    onMount({ getAnalysisTypesForCollection, appSession, loadAnalysis, params});
    expect(loadAnalysis.calledOnce).toBe(true);
    expect(loadAnalysis.getCall(0).args[0].token).toEqual('1234');
    expect(loadAnalysis.getCall(0).args[0].museumId).toEqual(new MuseumId(99));
  });
});