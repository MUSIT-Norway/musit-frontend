import { onMount } from '../eventsContainer';
import sinon from 'sinon';

describe('eventsContainer', () => {
  it('should have a working onMount', () => {
    const loadAnalyses = sinon.spy();
    const getCurrentLocation = sinon.spy();
    const setObject = sinon.spy();
    const clear = sinon.spy();
    const object = {
      id: 1,
      uuid: '12345677',
      term: 'Ærfugl',
      museumNo: 'MUSK123',
      subNo: 'Bæ'
    };
    const props = {
      appSession: {
        museumId: 99,
        collectionId: '1234567',
        accessToken: '1234'
      },
      location: {
        state: object
      },
      loadAnalyses,
      getCurrentLocation,
      setObject,
      clear
    };
    onMount(props);
    expect(loadAnalyses.callCount).toBe(1);
    expect(loadAnalyses.getCall(0).args[0].token).toBe('1234');
    expect(loadAnalyses.getCall(0).args[0].museumId).toEqual(99);
    expect(loadAnalyses.getCall(0).args[0].id).toBe('12345677');
    expect(loadAnalyses.getCall(0).args[0].objectId).toBe(1);
    expect(clear.callCount).toBe(1);
    expect(setObject.callCount).toBe(1);
    expect(setObject.getCall(0).args[0]).toEqual(object);
    expect(getCurrentLocation.callCount).toBe(1);
    expect(getCurrentLocation.getCall(0).args[0].token).toBe('1234');
    expect(getCurrentLocation.getCall(0).args[0].museumId).toEqual(99);
    expect(getCurrentLocation.getCall(0).args[0].objectId).toBe(1);
  });
});
