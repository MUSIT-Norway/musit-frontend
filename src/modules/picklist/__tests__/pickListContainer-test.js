import { moveItems, nodeCallback, objectCallback } from '../PickListContainer';
import sinon from 'sinon';

const appSession = {
  accessToken: '1234',
  museumId: 99,
  collectionId: '1234',
  actor: {
    dataportenId: '1234'
  }
};

describe('nodeCallback', () => {
  it('should refresh multiple nodes', () => {
    const onSuccess = sinon.spy();
    const onFailure = sinon.spy();
    const refreshNode = sinon.spy();
    const callback = nodeCallback(
      appSession,
      'Hei',
      2,
      'Ho',
      [{ id: 1 }, { id: 2 }],
      onSuccess,
      onFailure,
      refreshNode
    );
    callback.onComplete();
    expect(onSuccess.calledOnce).toBe(true);
    expect(refreshNode.callCount).toBe(2);
    callback.onFailure(new Error('Hei'));
  });

  it('should refresh single node', () => {
    const onSuccess = sinon.spy();
    const onFailure = sinon.spy();
    const refreshNode = sinon.spy();
    const callback = nodeCallback(
      appSession,
      'Hei',
      1,
      'Ho',
      [{ id: 1 }],
      onSuccess,
      onFailure,
      refreshNode
    );
    callback.onComplete();
    expect(onSuccess.calledOnce).toBe(true);
    expect(refreshNode.callCount).toBe(1);
    callback.onFailure(new Error('Hei'));
  });
});

describe('objectCallback', () => {
  it('should refresh multiple objects', () => {
    const onSuccess = sinon.spy();
    const onFailure = sinon.spy();
    const refreshObjects = sinon.spy();
    const callback = objectCallback(
      appSession,
      'Hei',
      2,
      'Ho',
      [{ id: 1 }, { id: 2 }],
      onSuccess,
      onFailure,
      refreshObjects
    );
    callback.onComplete();
    expect(onSuccess.calledOnce).toBe(true);
    expect(refreshObjects.callCount).toBe(1);
    callback.onFailure(new Error('Hei'));
  });

  it('should refresh single object', () => {
    const onSuccess = sinon.spy();
    const onFailure = sinon.spy();
    const refreshObject = sinon.spy();
    const callback = objectCallback(
      appSession,
      'Hei',
      1,
      'Ho',
      [{ id: 1 }],
      onSuccess,
      onFailure,
      refreshObject
    );
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
    moveItems(appSession, nodes, false, null, moveObject)(
      destination,
      'Lalala',
      onSuccess
    );
    expect(toPromise.calledOnce).toBe(true);
  });
});
