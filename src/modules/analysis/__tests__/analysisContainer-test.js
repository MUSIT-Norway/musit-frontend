import { onMount } from '../analysisAddContainer';
import sinon from 'sinon';
import { AppSession } from '../../app/appSession';
import MuseumId from '../../../models/museumId';

describe('analysisContainer', () => {
  it('should have working onMount', () => {
    const loadAnalysisTypes = sinon.spy();
    const appSession = new AppSession({ museumId: new MuseumId(99), accessToken: '1234' });
    onMount({ loadAnalysisTypes, appSession });
    expect(loadAnalysisTypes.calledOnce).toBe(true);
    expect(loadAnalysisTypes.getCall(0).args[0].token).toEqual('1234');
    expect(loadAnalysisTypes.getCall(0).args[0].museumId).toEqual(new MuseumId(99));
  });
});