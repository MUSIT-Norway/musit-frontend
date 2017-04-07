import { onMount } from '../viewObjectContainer';
import sinon from 'sinon';
import { AppSession } from '../../app/appSession';
import MuseumId from '../../../models/museumId';
import CollectionId from '../../../models/collectionId';

describe('ViewObjectContainer-test', () => {
  it('should have working onMount', () => {
    const loadObject = sinon.spy();
    const params = sinon.spy();
    const appSession = new AppSession({
      museumId: new MuseumId(99),
      collectionId: new CollectionId(99),
      accessToken: '1234'
    });
    onMount({ appSession, loadObject, params });
    expect(loadObject.calledOnce).toBe(true);
    expect(loadObject.getCall(0).args[0].token).toEqual('1234');
    expect(loadObject.getCall(0).args[0].museumId).toEqual(new MuseumId(99));
  });
});
