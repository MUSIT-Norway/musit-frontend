import {processBarcode} from '../PickListContainer';
import {AppSession} from '../../app/appSession';
import sinon from 'sinon';
import MuseumId from '../../../models/museumId';
import CollectionId from '../../../models/collectionId';
import {Observable} from 'rxjs';

describe('processBarcode', () => {

  const appSession = new AppSession({
    accessToken: '1234',
    museumId: new MuseumId(99),
    collectionId: new CollectionId('d3982b48-0000-0000-0000-6e38b59d57ed')
  });

  const barCodeWithUUID = {
    uuid: true,
    code: 'd3982b48-56c7-4d27-bc81-6e38b59d57ed'
  };

  const barCodeWithNumber = {
    number: true,
    code: 123456789
  };

  it('should emit error when receiving a uuid that does not exist', () => {
    const emitError = sinon.spy();
    const props = {
      findNodeByUUID: () => Observable.of(null),
      isTypeNode: () => true,
      classExistsOnDom: () => false,
      appSession,
      emitError
    };
    processBarcode(barCodeWithUUID, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should emit error when receiving a uuid when not on node picklist', () => {
    const emitError = sinon.spy();
    const props = {
      findNodeByUUID: () => Observable.of(null),
      isTypeNode: () => false,
      classExistsOnDom: () => false,
      appSession,
      emitError
    };
    processBarcode(barCodeWithUUID, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should update move dialog when receiving a uuid that exists when move dialog is open', () => {
    const updateMoveDialog = sinon.spy();
    const props = {
      findNodeByUUID: () => Observable.of({
        id: 1,
        name: 'Test'
      }),
      isTypeNode: () => true,
      classExistsOnDom: (clazz) => clazz === 'moveDialog',
      appSession,
      updateMoveDialog
    };
    processBarcode(barCodeWithUUID, props);
    expect(updateMoveDialog.calledOnce).toBe(true);
  });

  it('should add to node picklist when receiving a uuid that exists', () => {
    const addNode = sinon.spy();
    const props = {
      findNodeByUUID: () => Observable.of({
        id: 1,
        name: 'Test'
      }),
      isTypeNode: () => true,
      classExistsOnDom: () => false,
      appSession,
      addNode
    };
    processBarcode(barCodeWithUUID, props);
    expect(addNode.calledOnce).toBe(true);
  });

  it('should emit error when receiving a number that does not exists when node picklist is active', () => {
    const emitError = sinon.spy();
    const props = {
      findNodeByBarcode: () => Observable.of(null),
      isTypeNode: () => true,
      classExistsOnDom: () => false,
      appSession,
      emitError
    };
    processBarcode(barCodeWithNumber, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should emit error when receiving a number that does not exists when object picklist is active', () => {
    const emitError = sinon.spy();
    const props = {
      findObjectByBarcode: () => Observable.of(null),
      isTypeNode: () => false,
      classExistsOnDom: () => false,
      appSession,
      emitError
    };
    processBarcode(barCodeWithNumber, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should update move dialog when receiving a number that resolves to a single object when move dialog is active', () => {
    const updateMoveDialog = sinon.spy();
    const props = {
      findObjectByBarcode: () => Observable.of([
        {
          id: 1,
          term: 'Fugl'
        }
      ]),
      isTypeNode: () => false,
      classExistsOnDom: (clazz) => clazz === 'moveDialog',
      appSession,
      updateMoveDialog
    };
    processBarcode(barCodeWithNumber, props);
    expect(updateMoveDialog.calledOnce).toBe(true);
  });

  it('should add to object picklist when receiving a number that resolves to a single object', () => {
    const addObject = sinon.spy();
    const props = {
      findObjectByBarcode: () => Observable.of([
        {
          id: 1,
          term: 'Fugl'
        }
      ]),
      isTypeNode: () => false,
      classExistsOnDom: () => false,
      appSession,
      addObject
    };
    processBarcode(barCodeWithNumber, props);
    expect(addObject.calledOnce).toBe(true);
  });

  it('should emit error when receiving a number that resolves to multiple objects', () => {
    const emitError = sinon.spy();
    const props = {
      findObjectByBarcode: () => Observable.of([
        {
          id: 1,
          term: 'Fugl'
        },
        {
          id: 2,
          term: 'Fisk'
        }
      ]),
      isTypeNode: () => false,
      classExistsOnDom: () => false,
      appSession,
      emitError
    };
    processBarcode(barCodeWithNumber, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should update move dialog when receiving a number that resolves to a single node', () => {
    const updateMoveDialog = sinon.spy();
    const props = {
      findNodeByBarcode: () => Observable.of({
        id: 1,
        name: 'Test',
        nodeId: '1234'
      }),
      isTypeNode: () => true,
      classExistsOnDom: (clazz) => clazz === 'moveDialog',
      appSession,
      updateMoveDialog
    };
    processBarcode(barCodeWithNumber, props);
    expect(updateMoveDialog.calledOnce).toBe(true);
  });

  it('should add to node picklist when receiving a number that resolves to a single node', () => {
    const addNode = sinon.spy();
    const props = {
      findNodeByBarcode: () => Observable.of({
        id: 1,
        name: 'Test',
        nodeId: '1234'
      }),
      isTypeNode: () => true,
      classExistsOnDom: () => false,
      appSession,
      addNode
    };
    processBarcode(barCodeWithNumber, props);
    expect(addNode.calledOnce).toBe(true);
  });

  it('should emit error when receiving a number that resolves to a bogus response (nodes active)', () => {
    const emitError = sinon.spy();
    const props = {
      findNodeByBarcode: () => Observable.of({
        id: 1,
        name: 'Test'
        // Missing nodeId!
      }),
      isTypeNode: () => true,
      classExistsOnDom: () => false,
      appSession,
      emitError
    };
    processBarcode(barCodeWithNumber, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should emit error when receiving a number that resolves to a bogus response (objects active)', () => {
    const emitError = sinon.spy();
    const props = {
      findObjectByBarcode: () => Observable.of({
        id: 1,
        name: 'Test'
        // Missing nodeId!
      }),
      isTypeNode: () => false,
      classExistsOnDom: () => false,
      appSession,
      emitError
    };
    processBarcode(barCodeWithNumber, props);
    expect(emitError.calledOnce).toBe(true);
  });
});