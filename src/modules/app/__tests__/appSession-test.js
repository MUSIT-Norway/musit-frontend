import {refreshSession, AppSession } from './../appSession';
import MuseumId from '../../../models/museumId';
import CollectionId from '../../../models/collectionId';
import sinon from 'sinon';


describe('RefreshSession', () => {

  let setMuseumId;
  let setCollectionId;
  let goto;

  beforeEach(() => {
    setMuseumId = sinon.spy();
    setCollectionId = sinon.spy();
    goto = sinon.spy();
  });

  it('It should refresh session if params is different.', () => {
    const params = {
      museumId: 98,
      collectionId: 'Vascular Plant'
    };
    const appSession = new AppSession({
      museumId: 99,
      collectionId: 'Lichens'
    });
    refreshSession(setMuseumId, setCollectionId)(params, appSession, goto);
    expect(goto.calledOnce).toBe(true);
    expect(setMuseumId.calledOnce).toBe(true);
    expect(setMuseumId.getCall(0).args[0]).toBe(98);
    expect(setCollectionId.calledOnce).toBe(true);
    expect(setCollectionId.getCall(0).args[0]).toBe('Vascular Plant');
    expect(goto.getCall(0).args[0]).toBe('/museum/98/collections/Vascular Plant');
  });

  it('It should NOT refresh museum if museumId is null.', () => {
    const params = {
      museumId: null,
      collectionId: 'Vascular Plant'
    };
    const appSession = new AppSession({
      museumId: new MuseumId(99),
      collectionId: 'Lichens'
    });
    refreshSession(setMuseumId, setCollectionId)(params, appSession, goto);
    expect(goto.calledOnce).toBe(true);
    expect(setMuseumId.calledOnce).toBe(false);
    expect(setCollectionId.calledOnce).toBe(true);
    expect(setCollectionId.getCall(0).args[0]).toBe('Vascular Plant');
    expect(goto.getCall(0).args[0]).toBe('/museum/99/collections/Vascular Plant');
  });

  it('It should NOT refresh collection if collection is null.', () => {
    const params = {
      museumId: null,
      collectionId: null
    };
    const appSession = new AppSession({
      museumId: new MuseumId(99),
      collectionId: new CollectionId('Lichens')
    });
    refreshSession(setMuseumId, setCollectionId)(params, appSession, goto);
    expect(goto.calledOnce).toBe(true);
    expect(setMuseumId.calledOnce).toBe(false);
    expect(setCollectionId.calledOnce).toBe(false);
    expect(goto.getCall(0).args[0]).toBe('/museum/99/collections/Lichens');
  });

  it('It should NOT do anything if appSession is empty.', () => {
    const params = {
      museumId: null,
      collectionId: null
    };
    const appSession = new AppSession({
      museumId: null,
      collectionId: null
    });
    refreshSession(setMuseumId, setCollectionId)(params, appSession, goto);
    expect(goto.calledOnce).toBe(false);
    expect(setMuseumId.calledOnce).toBe(false);
    expect(setCollectionId.calledOnce).toBe(false);
  });

  it('It should NOT fail if appSession is empty and params is non empty.', () => {
    const params = {
      museumId: 99,
      collectionId: 'Vulcans'
    };
    const appSession = new AppSession({
      museumId: null,
      collectionId: null
    });
    refreshSession(setMuseumId, setCollectionId)(params, appSession, goto);
    expect(goto.calledOnce).toBe(true);
    expect(setMuseumId.calledOnce).toBe(true);
    expect(setCollectionId.calledOnce).toBe(true);
    expect(goto.getCall(0).args[0]).toBe('/museum/99/collections/Vulcans');
  });
});