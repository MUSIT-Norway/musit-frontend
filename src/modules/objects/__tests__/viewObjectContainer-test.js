import { onMount } from '../viewObjectContainer';
import sinon from 'sinon';

describe('ViewObjectContainer-test', () => {
  it('should have working onMount', () => {
    const loadObject = sinon.spy();
    const loadSampleEvents = sinon.spy();
    const loadMoveAndAnalysisEvents = sinon.spy();
    const getAnalysisTypes = sinon.spy();
    const getSampleTypes = sinon.spy();
    const match = { params: { id: '123' } };
    const appSession = {
      museumId: 99,
      collectionId: '1234455',
      accessToken: '1234'
    };
    onMount({
      appSession,
      loadObject,
      loadSampleEvents,
      loadMoveAndAnalysisEvents,
      match,
      getAnalysisTypes,
      getSampleTypes
    });
    expect(getSampleTypes.calledOnce).toBe(true);
    expect(getAnalysisTypes.calledOnce).toBe(true);
    expect(loadObject.calledOnce).toBe(true);
    expect(loadObject.getCall(0).args[0].token).toEqual('1234');
    expect(loadObject.getCall(0).args[0].museumId).toEqual(99);
    expect(loadObject.getCall(0).args[0].collectionId).toEqual('1234455');
    expect(loadSampleEvents.calledOnce).toBe(true);
    expect(loadSampleEvents.getCall(0).args[0].token).toEqual('1234');
    expect(loadSampleEvents.getCall(0).args[0].museumId).toEqual(99);
    expect(loadSampleEvents.getCall(0).args[0].collectionId).toEqual('1234455');
    expect(loadMoveAndAnalysisEvents.calledOnce).toBe(true);
    expect(loadMoveAndAnalysisEvents.getCall(0).args[0].token).toEqual('1234');
    expect(loadMoveAndAnalysisEvents.getCall(0).args[0].museumId).toEqual(99);
    expect(loadMoveAndAnalysisEvents.getCall(0).args[0].collectionId).toEqual('1234455');
  });
});
