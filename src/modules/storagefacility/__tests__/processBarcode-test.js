import { processBarcode } from '../TableComponent';
import { AppSession } from '../../app/appSession';
import sinon from 'sinon';
import MuseumId from '../../../models/museumId';
import CollectionId from '../../../models/collectionId';
import { Observable } from 'rxjs';

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
      classExistsOnDom: () => false,
      appSession,
      emitError
    };
    processBarcode(barCodeWithUUID, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should update move dialog when receiving a uuid when move dialog is open', () =>  {
    const updateMoveDialog = sinon.spy();
    const props = {
      findNodeByUUID: () => Observable.of({
        id: 1,
        name: 'Test'
      }),
      classExistsOnDom: (clazz) => clazz === 'moveDialog',
      appSession,
      updateMoveDialog
    };
    processBarcode(barCodeWithUUID, props);
    expect(updateMoveDialog.calledOnce).toBe(true);
  });

  it('should emit error when receiving a uuid that exists when move history is open', () =>  {
    const emitError = sinon.spy();
    const props = {
      findNodeByUUID: () => Observable.of({
        id: 1,
        name: 'Test'
      }),
      classExistsOnDom: (clazz) => clazz === 'moveHistory',
      appSession,
      emitError
    };
    processBarcode(barCodeWithUUID, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should go to node location when receiving a uuid that exists', () =>  {
    const goTo = sinon.spy();
    const props = {
      findNodeByUUID: () => Observable.of({
        id: 1,
        name: 'Test'
      }),
      classExistsOnDom: () => false,
      appSession,
      goTo
    };
    processBarcode(barCodeWithUUID, props);
    expect(goTo.calledOnce).toBe(true);
  });

  it('should emit error when receiving a number that does not exist', () =>  {
    const emitError = sinon.spy();
    const props = {
      findNodeOrObjectByBarcode: () => Observable.of(null),
      classExistsOnDom: () => false,
      appSession,
      emitError
    };
    processBarcode(barCodeWithNumber, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should emit error when receiving an number that resolves to an array with a single object without currentLocationId', () =>  {
    const emitError = sinon.spy();
    const props = {
      findNodeOrObjectByBarcode: () => Observable.of([
        {
          id: 1,
          term: 'Fugl'
        }
      ]),
      classExistsOnDom: () => false,
      appSession,
      emitError
    };
    processBarcode(barCodeWithNumber, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should update move dialog when receiving an number that resolves to an array with a single object when move dialog is open', () =>  {
    const updateMoveDialog = sinon.spy();
    const props = {
      findNodeOrObjectByBarcode: () => Observable.of([
        {
          id: 1,
          term: 'Fugl',
          currentLocationId: 45
        }
      ]),
      classExistsOnDom: (clazz) => clazz === 'moveDialog',
      appSession,
      updateMoveDialog
    };
    processBarcode(barCodeWithNumber, props);
    expect(updateMoveDialog.calledOnce).toBe(true);
  });

  it('should emit error when receiving an number that resolves to an array with a single object when move history is open', () =>  {
    const emitError = sinon.spy();
    const props = {
      findNodeOrObjectByBarcode: () => Observable.of([
        {
          id: 1,
          term: 'Fugl',
          currentLocationId: 45
        }
      ]),
      classExistsOnDom: (clazz) => clazz === 'moveHistory',
      appSession,
      emitError
    };
    processBarcode(barCodeWithNumber, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should go to node location when receiving an number that resolves to an array with a single object', () =>  {
    const goTo = sinon.spy();
    const props = {
      findNodeOrObjectByBarcode: () => Observable.of([
        {
          id: 1,
          term: 'Fugl',
          currentLocationId: 45
        }
      ]),
      classExistsOnDom: () => false,
      appSession,
      goTo
    };
    processBarcode(barCodeWithNumber, props);
    expect(goTo.calledOnce).toBe(true);
  });

  it('should emit error when receiving an number that resolves to an array with multiple objects', () =>  {
    const emitError = sinon.spy();
    const props = {
      findNodeOrObjectByBarcode: () => Observable.of([
        {
          id: 1,
          term: 'Fugl',
          currentLocationId: 45
        },
        {
          id: 2,
          term: 'Fisk',
          currentLocationId: 45
        }
      ]),
      classExistsOnDom: () => false,
      appSession,
      emitError
    };
    processBarcode(barCodeWithNumber, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should update move dialog when receiving an number that resolves to a node when move dialog is open', () =>  {
    const updateMoveDialog = sinon.spy();
    const props = {
      findNodeOrObjectByBarcode: () => Observable.of({
        id: 1,
        nodeId: 'someUUID',
        name: 'Test'
      }),
      classExistsOnDom: (clazz) => clazz === 'moveDialog',
      appSession,
      updateMoveDialog
    };
    processBarcode(barCodeWithNumber, props);
    expect(updateMoveDialog.calledOnce).toBe(true);
  });

  it('should emit error when receiving an number that resolves to a node when move history is open', () =>  {
    const emitError = sinon.spy();
    const props = {
      findNodeOrObjectByBarcode: () => Observable.of({
        id: 1,
        nodeId: 'someUUID',
        name: 'Test'
      }),
      classExistsOnDom: (clazz) => clazz === 'moveHistory',
      appSession,
      emitError
    };
    processBarcode(barCodeWithNumber, props);
    expect(emitError.calledOnce).toBe(true);
  });

  it('should go to node location when receiving an number that resolves to a node', () =>  {
    const goTo = sinon.spy();
    const props = {
      findNodeOrObjectByBarcode: () => Observable.of({
        id: 1,
        nodeId: 'someUUID',
        name: 'Test'
      }),
      classExistsOnDom: () => false,
      appSession,
      goTo
    };
    processBarcode(barCodeWithNumber, props);
    expect(goTo.calledOnce).toBe(true);
  });
});