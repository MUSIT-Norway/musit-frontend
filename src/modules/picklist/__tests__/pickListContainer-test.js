import { moveItems, nodeCallback, objectCallback } from '../PickListContainer';
import { AppSession } from '../../app/appSession';
import MuseumId  from '../../../models/museumId';
import CollectionId  from '../../../models/collectionId';
import sinon from 'sinon';

const appSession = new AppSession({
  accessToken: '1234',
  museumId: new MuseumId(99),
  collectionId: new CollectionId('1234'),
  actor: {
    getActorId: () => 1
  }
});

describe('nodeCallback', () => {
  it('should refresh multiple nodes', () => {
    const onSuccess = sinon.spy();
    const refreshNode = sinon.spy();
    const callback = nodeCallback(appSession, 'Hei', 2, 'Ho', [{ id: 1}, { id: 2}], onSuccess, refreshNode);
    callback.onComplete();
    expect(onSuccess.calledOnce).toBe(true);
    expect(refreshNode.callCount).toBe(2);
    callback.onFailure(new Error('Hei'));
  });

  it('should refresh single node', () => {
    const onSuccess = sinon.spy();
    const refreshNode = sinon.spy();
    const callback = nodeCallback(appSession, 'Hei', 1, 'Ho', [{ id: 1}], onSuccess, refreshNode);
    callback.onComplete();
    expect(onSuccess.calledOnce).toBe(true);
    expect(refreshNode.callCount).toBe(1);
    callback.onFailure(new Error('Hei'));
  });
});

describe('objectCallback', () => {
  it('should refresh multiple objects', () => {
    const onSuccess = sinon.spy();
    const refreshObjects = sinon.spy();
    const callback = objectCallback(appSession, 'Hei', 2, 'Ho', [{ id: 1}, { id: 2}], onSuccess, refreshObjects);
    callback.onComplete();
    expect(onSuccess.calledOnce).toBe(true);
    expect(refreshObjects.callCount).toBe(1);
    callback.onFailure(new Error('Hei'));
  });

  it('should refresh single object', () => {
    const onSuccess = sinon.spy();
    const refreshObject = sinon.spy();
    const callback = objectCallback(appSession, 'Hei', 1, 'Ho', [{ id: 1}], onSuccess, refreshObject);
    callback.onComplete();
    expect(onSuccess.calledOnce).toBe(true);
    expect(refreshObject.callCount).toBe(1);
    callback.onFailure(new Error('Hei'));
  });
});

describe('moveItems', () => {
  it('should move node', () => {
    const toPromise = sinon.spy();
    const moveNode = () => ({
      toPromise
    });
    const onSuccess = sinon.spy();
    const destination = {
      id: 1,
      nodeId: '123456778',
      name: 'Lalala'
    };
    const nodes = [
      {
        id: 1,
        name: 'Uffameg'
      }
    ];
    moveItems(appSession, nodes, true, moveNode, null)(destination, 'Lalala', onSuccess);
    expect(toPromise.calledOnce).toBe(true);
  });

  it('should move object', () => {
    const toPromise = sinon.spy();
    const moveObject = () => ({
      toPromise
    });
    const onSuccess = sinon.spy();
    const destination = {
      id: 1,
      nodeId: '123456778',
      name: 'Lalala'
    };
    const nodes = [
      {
        id: 1,
        name: 'Uffameg'
      }
    ];
    moveItems(appSession, nodes, false, null, moveObject)(destination, 'Lalala', onSuccess);
    expect(toPromise.calledOnce).toBe(true);
  });
});