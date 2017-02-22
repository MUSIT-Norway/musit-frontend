import { TestScheduler, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$, scanForNode, scanForNodeOrObject } from '../scanner';
import { createStore } from 'react-rxjs/dist/RxStore';
import MuseumId from '../../../models/museumId';
import CollectionId from '../../../models/collectionId';
const diff = require('deep-diff').diff;
import sinon from 'sinon';

describe('scanner', () => {

  it('should display error when scanning node UUID that does not exist', () => {
    const ajaxGet = () => Observable.of({ response:  null });
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const scanForUUID = scanForNode(ajaxGet, goTo, showError, clearSearch);
    scanForUUID({ uuid: '1234', museumId: new MuseumId(99), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(true);
    const errorMsg = showError.getCall(0).args[0].message;
    expect(errorMsg).toEqual('Fant ingen node med denne strekkoden.');
    expect(clearSearch.calledOnce).toBe(true);
  });

  it('should update move dialog when move dialog is active', () => {
    const ajaxGet = () => Observable.of({response:  {
      id: 1,
      nodeId: '3456',
      name: 'Test',
      type: 'Room'
    }});
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const clearBuffer = sinon.spy();
    const loadNode = sinon.spy();
    const loadChildren = sinon.spy();
    const scanForUUID = scanForNode(ajaxGet, goTo, showError, clearSearch, clearBuffer, loadNode, loadChildren, null, () => true);
    scanForUUID({ uuid: '1234', museumId: new MuseumId(99), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(false);
    expect(clearSearch.calledOnce).toBe(false);
    expect(clearBuffer.calledOnce).toBe(true);
    expect(loadNode.calledOnce).toBe(true);
    const loadNodeCmd = loadNode.getCall(0).args[0];
    expect(loadNodeCmd.token).toBe('1234');
    expect(loadNodeCmd.id).toBe(1);
    expect(loadNodeCmd.museumId).toEqual(new MuseumId(99));
    expect(loadChildren.calledOnce).toBe(true);
    const loadChildrenCmd = loadChildren.getCall(0).args[0];
    expect(loadChildrenCmd.token).toBe('1234');
    expect(loadChildrenCmd.id).toBe(1);
    expect(loadChildrenCmd.museumId).toEqual(new MuseumId(99));
  });

  it('should add to node picklist when node picklist is active', () => {
    const value = {
      id: 1,
      nodeId: '3456',
      name: 'Test',
      type: 'Room',
      path: ',1,2,',
      pathNames: [{ nodeId: 1, name: 'Test'}, { nodeId: 2, name: 'Tull'}]
    };
    const ajaxGet = () => Observable.of({response:  value});
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const clearBuffer = sinon.spy();
    const loadNode = sinon.spy();
    const loadChildren = sinon.spy();
    const addNode = sinon.spy();
    const scanForUUID = scanForNode(ajaxGet, goTo, showError, clearSearch, clearBuffer, loadNode, loadChildren, addNode,
      () => false, () =>  true);
    scanForUUID({ uuid: '1234', museumId: new MuseumId(99), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(false);
    expect(clearSearch.calledOnce).toBe(false);
    expect(clearBuffer.calledOnce).toBe(true);
    expect(loadNode.calledOnce).toBe(false);
    expect(loadChildren.calledOnce).toBe(false);
    expect(addNode.calledOnce).toBe(true);
    const addNodeCmd = addNode.getCall(0).args[0];
    expect(addNodeCmd.value).toEqual({...value, breadcrumb:[
      { id: 1, name: 'Test', url: '/magasin/1'},
      { id: 2, name: 'Tull', url: '/magasin/2'}
    ]});
    expect(addNodeCmd.path).toEqual([{'id':1,'name':'Test','url':'/magasin/1'},{'id':2,'name':'Tull','url':'/magasin/2'}]);
  });

  it('should navigate to node when storagefacility is active', () => {
    const value = {
      id: 1,
      nodeId: '3456',
      name: 'Test',
      type: 'Room',
      path: ',1,2,',
      pathNames: [{ nodeId: 1, name: 'Test'}, { nodeId: 2, name: 'Tull'}]
    };
    const ajaxGet = () => Observable.of({response:  value});
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const clearBuffer = sinon.spy();
    const loadNode = sinon.spy();
    const loadChildren = sinon.spy();
    const addNode = sinon.spy();
    const scanForUUID = scanForNode(ajaxGet, goTo, showError, clearSearch, clearBuffer, loadNode, loadChildren, addNode,
      () => false, () =>  false, () => true);
    scanForUUID({ uuid: '1234', museumId: new MuseumId(99), token: '1234'});
    expect(goTo.calledOnce).toBe(true);
    expect(goTo.getCall(0).args[0]).toEqual('/magasin/1');
    expect(showError.calledOnce).toBe(false);
    expect(clearSearch.calledOnce).toBe(false);
    expect(clearBuffer.calledOnce).toBe(true);
    expect(loadNode.calledOnce).toBe(false);
    expect(loadChildren.calledOnce).toBe(false);
    expect(addNode.calledOnce).toBe(false);
  });

  it('should give error when scanning node on non supported page', () => {
    const value = {
      id: 1,
      nodeId: '3456',
      name: 'Test',
      type: 'Room',
      path: ',1,2,',
      pathNames: [{ nodeId: 1, name: 'Test'}, { nodeId: 2, name: 'Tull'}]
    };
    const ajaxGet = () => Observable.of({response:  value});
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const clearBuffer = sinon.spy();
    const loadNode = sinon.spy();
    const loadChildren = sinon.spy();
    const addNode = sinon.spy();
    const scanForUUID = scanForNode(ajaxGet, goTo, showError, clearSearch, clearBuffer, loadNode, loadChildren, addNode,
      () => false, () =>  false, () => false);
    scanForUUID({ uuid: '1234', museumId: new MuseumId(99), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(true);
    const errorMsg = showError.getCall(0).args[0].message;
    expect(errorMsg).toEqual('Dette skjermbildet håndterer ikke scanning av noder.');
    expect(clearSearch.calledOnce).toBe(true);
    expect(clearBuffer.calledOnce).toBe(false);
    expect(loadNode.calledOnce).toBe(false);
    expect(loadChildren.calledOnce).toBe(false);
    expect(addNode.calledOnce).toBe(false);
  });

  it('should display error when scanning barcode that does not exist', () => {
    const ajaxGet = () => Observable.of({ response: null });
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const scanForUUID = scanForNodeOrObject(
      ajaxGet,
      goTo,
      showError,
      null,
      null,
      clearSearch
    );
    scanForUUID({ barcode: '1234', museumId: new MuseumId(99), collectionId: new CollectionId('1234'), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(true);
    const errorMsg = showError.getCall(0).args[0].message;
    expect(errorMsg).toEqual('Fant ingen node eller objekt med denne strekkoden.');
    expect(clearSearch.calledOnce).toBe(true);
  });

  it('should add to object picklist when scanning barcode that returns a single object', () => {
    const ajaxGet = (url) => {
      if (url.indexOf('thingaggregate') > -1) {
        return Observable.of({
          response: [
            {
              id: 1,
              term: 'Some chair',
              museumNo: 'MUSK45',
              subNo: '99',
              currentLocationId: 45,
              path: ',1,2,',
              pathNames: [ { nodeId: 1, name: 'Test'}, { nodeId: 2, name: 'Tull'}]
            }
          ]
        });
      }
      return Observable.of({ response: null });
    };
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const addObject = sinon.spy();
    const clearBuffer = sinon.spy();
    const scanForUUID = scanForNodeOrObject(
      ajaxGet,
      goTo,
      showError,
      null,
      addObject,
      clearSearch,
      clearBuffer,
      null,
      null,
      null,
      null,
      null,
      () => true
    );
    scanForUUID({ barcode: '1234', museumId: new MuseumId(99), collectionId: new CollectionId('1234'), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(false);
    expect(clearSearch.calledOnce).toBe(false);
    expect(addObject.calledOnce).toBe(true);
    expect(addObject.getCall(0).args[0].value).toEqual({
      id: 1,
      term: 'Some chair',
      museumNo: 'MUSK45',
      subNo: '99',
      currentLocationId: 45,
      path: ',1,2,',
      pathNames: [ { nodeId: 1, name: 'Test'}, { nodeId: 2, name: 'Tull'}]
    });
    expect(addObject.getCall(0).args[0].path).toEqual([
      {'id': 1, 'name': 'Test', 'url': '/magasin/1'},
      {'id': 2, 'name': 'Tull', 'url': '/magasin/2'}
    ]);
    expect(clearBuffer.calledOnce).toBe(true);
  });

  it('should display error when scanned barcode matches object without location', () => {
    const ajaxGet = (url) => {
      if (url.indexOf('thingaggregate') > -1) {
        return Observable.of({
          response: [
            {
              id: 1,
              term: 'Some chair',
              museumNo: 'MUSK45',
              subNo: '99'
            }
          ]
        });
      }
      return Observable.of({ response: null });
    };
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const addObject = sinon.spy();
    const clearBuffer = sinon.spy();
    const scanForUUID = scanForNodeOrObject(
      ajaxGet,
      goTo,
      showError,
      null,
      addObject,
      clearSearch,
      clearBuffer,
      null,
      null,
      null,
      null,
      null,
      () => false,
      () => true
    );
    scanForUUID({ barcode: '1234', museumId: new MuseumId(99), collectionId: new CollectionId('1234'), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(true);
    const errorMsg = showError.getCall(0).args[0].message;
    expect(errorMsg).toEqual('Objektet har ingen plassering i magasinet.');
    expect(clearSearch.calledOnce).toBe(true);
    expect(addObject.calledOnce).toBe(false);
    expect(clearBuffer.calledOnce).toBe(false);
  });

  it('should go to object location when scanned barcode matches object with location', () => {
    const ajaxGet = (url) => {
      if (url.indexOf('thingaggregate') > -1) {
        return Observable.of({
          response: [
            {
              id: 1,
              term: 'Some chair',
              museumNo: 'MUSK45',
              subNo: '99',
              currentLocationId: 45
            }
          ]
        });
      }
      return Observable.of({ response: null });
    };
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const addObject = sinon.spy();
    const clearBuffer = sinon.spy();
    const scanForUUID = scanForNodeOrObject(
      ajaxGet,
      goTo,
      showError,
      null,
      addObject,
      clearSearch,
      clearBuffer,
      null,
      null,
      null,
      null,
      null,
      () => false,
      () => true
    );
    scanForUUID({ barcode: '1234', museumId: new MuseumId(99), collectionId: new CollectionId('1234'), token: '1234'});
    expect(goTo.calledOnce).toBe(true);
    expect(goTo.getCall(0).args[0]).toEqual('/magasin/45/objects');
    expect(showError.calledOnce).toBe(false);
    expect(clearSearch.calledOnce).toBe(false);
    expect(addObject.calledOnce).toBe(false);
    expect(clearBuffer.calledOnce).toBe(true);
  });

  it('should show error message when scanning on pages that doesnt support scanning', () => {
    const ajaxGet = (url) => {
      if (url.indexOf('thingaggregate') > -1) {
        return Observable.of({
          response: [
            {
              id: 1,
              term: 'Some chair',
              museumNo: 'MUSK45',
              subNo: '99',
              currentLocationId: 45
            }
          ]
        });
      }
      return Observable.of({ response: null });
    };
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const addObject = sinon.spy();
    const clearBuffer = sinon.spy();
    const scanForUUID = scanForNodeOrObject(
      ajaxGet,
      goTo,
      showError,
      null,
      addObject,
      clearSearch,
      clearBuffer,
      null,
      null,
      null,
      null,
      null,
      () => false,
      () => false
    );
    scanForUUID({ barcode: '1234', museumId: new MuseumId(99), collectionId: new CollectionId('1234'), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(true);
    const message = showError.getCall(0).args[0].message;
    expect(message).toEqual('Dette skjermbildet håndterer ikke scanning av objekter.');
    expect(clearSearch.calledOnce).toBe(true);
    expect(addObject.calledOnce).toBe(false);
    expect(clearBuffer.calledOnce).toBe(false);
  });

  it('should add matches to store when scanning barcode that returns multiple objects', () => {
    const ajaxGet = (url) => {
      if (url.indexOf('thingaggregate') > -1) {
        return Observable.of({
          response: [
            {
              id: 1,
              term: 'Some chair',
              museumNo: 'MUSK45',
              subNo: '99',
              currentLocationId: 45
            },
            {
              id: 2,
              term: 'Some chair 2',
              museumNo: 'MUSK47',
              subNo: '99',
              currentLocationId: 45
            }
          ]
        });
      }
      return Observable.of({ response: null });
    };
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const addObject = sinon.spy();
    const addMatches = sinon.spy();
    const clearBuffer = sinon.spy();
    const scanForUUID = scanForNodeOrObject(
      ajaxGet,
      goTo,
      showError,
      addMatches,
      addObject,
      clearSearch,
      clearBuffer,
      null,
      null,
      null,
      null,
      null,
      () => false,
      () => false
    );
    scanForUUID({ barcode: '1234', museumId: new MuseumId(99), collectionId: new CollectionId('1234'), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(false);
    expect(clearSearch.calledOnce).toBe(false);
    expect(addObject.calledOnce).toBe(false);
    expect(clearBuffer.calledOnce).toBe(false);
    expect(addMatches.calledOnce).toBe(true);
    expect(addMatches.getCall(0).args[0]).toEqual(
      [
        {
          id: 1,
          term: 'Some chair',
          museumNo: 'MUSK45',
          subNo: '99',
          currentLocationId: 45
        },
        {
          id: 2,
          term: 'Some chair 2',
          museumNo: 'MUSK47',
          subNo: '99',
          currentLocationId: 45
        }
      ]
    );
  });

  it('should give error message when scanning barcode that returns no objects', () => {
    const ajaxGet = (url) => {
      if (url.indexOf('thingaggregate') > -1) {
        return Observable.of({
          response: []
        });
      }
      return Observable.of({ response: null });
    };
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const addObject = sinon.spy();
    const addMatches = sinon.spy();
    const clearBuffer = sinon.spy();
    const scanForUUID = scanForNodeOrObject(
      ajaxGet,
      goTo,
      showError,
      addMatches,
      addObject,
      clearSearch,
      clearBuffer,
      null,
      null,
      null,
      null,
      null,
      () => false,
      () => false
    );
    scanForUUID({ barcode: '1234', museumId: new MuseumId(99), collectionId: new CollectionId('1234'), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(true);
    expect(showError.getCall(0).args[0].message).toEqual('Fant ingen node eller objekt med denne strekkoden.');
    expect(clearSearch.calledOnce).toBe(true);
    expect(addObject.calledOnce).toBe(false);
    expect(clearBuffer.calledOnce).toBe(false);
    expect(addMatches.calledOnce).toBe(false);
  });

  it('should give error message when scanning barcode that returns a node on a page that doesnt support scanning', () => {
    const ajaxGet = () => {
      return Observable.of({
        response: {
          id: 1,
          nodeId: '1234',
          name: 'Test',
          type: 'Room'
        }
      });
    };
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const addObject = sinon.spy();
    const addMatches = sinon.spy();
    const clearBuffer = sinon.spy();
    const scanForUUID = scanForNodeOrObject(
      ajaxGet,
      goTo,
      showError,
      addMatches,
      addObject,
      clearSearch,
      clearBuffer,
      null,
      null,
      null,
      () => false,
      () => false,
      () => false,
      () => false
    );
    scanForUUID({ barcode: '1234', museumId: new MuseumId(99), collectionId: new CollectionId('1234'), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(true);
    expect(showError.getCall(0).args[0].message).toEqual(
      'Dette skjermbildet håndterer ikke scanning av noder.'
    );
    expect(clearSearch.calledOnce).toBe(true);
    expect(addObject.calledOnce).toBe(false);
    expect(clearBuffer.calledOnce).toBe(false);
    expect(addMatches.calledOnce).toBe(false);
  });

  it('should update move dialog when scanning barcode that returns a node when move dialog is active', () => {
    const ajaxGet = () => {
      return Observable.of({
        response: {
          id: 1,
          nodeId: '1234',
          name: 'Test',
          type: 'Room'
        }
      });
    };
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const addObject = sinon.spy();
    const addMatches = sinon.spy();
    const clearBuffer = sinon.spy();
    const loadNode = sinon.spy();
    const loadChildren = sinon.spy();
    const scanForUUID = scanForNodeOrObject(
      ajaxGet,
      goTo,
      showError,
      addMatches,
      addObject,
      clearSearch,
      clearBuffer,
      loadNode,
      loadChildren,
      null,
      () => true,
      () => false,
      () => false,
      () => false
    );
    scanForUUID({ barcode: '1234', museumId: new MuseumId(99), collectionId: new CollectionId('1234'), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(false);
    expect(clearSearch.calledOnce).toBe(false);
    expect(addObject.calledOnce).toBe(false);
    expect(loadNode.calledOnce).toBe(true);
    const loadNodeCmd = loadNode.getCall(0).args[0];
    expect(loadNodeCmd.token).toBe('1234');
    expect(loadNodeCmd.id).toBe(1);
    expect(loadNodeCmd.museumId).toEqual(new MuseumId(99));
    expect(loadChildren.calledOnce).toBe(true);
    const loadChildrenCmd = loadChildren.getCall(0).args[0];
    expect(loadChildrenCmd.token).toBe('1234');
    expect(loadChildrenCmd.id).toBe(1);
    expect(loadChildrenCmd.museumId).toEqual(new MuseumId(99));
    expect(clearBuffer.calledOnce).toBe(true);
    expect(addMatches.calledOnce).toBe(false);
  });

  it('should add to node picklist when scanning barcode that returns a node when node picklist is active', () => {
    const value = {
      id: 1,
      nodeId: '3456',
      name: 'Test',
      type: 'Room',
      path: ',1,2,',
      pathNames: [{ nodeId: 1, name: 'Test'}, { nodeId: 2, name: 'Tull'}]
    };
    const ajaxGet = () => {
      return Observable.of({
        response: value
      });
    };
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const addObject = sinon.spy();
    const addMatches = sinon.spy();
    const clearBuffer = sinon.spy();
    const loadNode = sinon.spy();
    const loadChildren = sinon.spy();
    const addNode = sinon.spy();
    const scanForUUID = scanForNodeOrObject(
      ajaxGet,
      goTo,
      showError,
      addMatches,
      addObject,
      clearSearch,
      clearBuffer,
      loadNode,
      loadChildren,
      addNode,
      () => false,
      () => true,
      () => false,
      () => false
    );
    scanForUUID({ barcode: '1234', museumId: new MuseumId(99), collectionId: new CollectionId('1234'), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(false);
    expect(clearSearch.calledOnce).toBe(false);
    expect(addObject.calledOnce).toBe(false);
    expect(addNode.calledOnce).toBe(true);
    const addNodeCmd = addNode.getCall(0).args[0];
    expect(addNodeCmd.value).toEqual({...value, breadcrumb:[
      { id: 1, name: 'Test', url: '/magasin/1'},
      { id: 2, name: 'Tull', url: '/magasin/2'}
    ]});
    expect(addNodeCmd.path).toEqual([{'id':1,'name':'Test','url':'/magasin/1'},{'id':2,'name':'Tull','url':'/magasin/2'}]);
    expect(clearBuffer.calledOnce).toBe(true);
    expect(addMatches.calledOnce).toBe(false);
  });

  it('should go to node location when scanning barcode that returns a node when storagefacility is active', () => {
    const value = {
      id: 45,
      nodeId: '3456',
      name: 'Test',
      type: 'Room',
      path: ',1,2,',
      pathNames: [{ nodeId: 1, name: 'Test'}, { nodeId: 2, name: 'Tull'}]
    };
    const ajaxGet = () => {
      return Observable.of({
        response: value
      });
    };
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const addObject = sinon.spy();
    const addMatches = sinon.spy();
    const clearBuffer = sinon.spy();
    const loadNode = sinon.spy();
    const loadChildren = sinon.spy();
    const addNode = sinon.spy();
    const scanForUUID = scanForNodeOrObject(
      ajaxGet,
      goTo,
      showError,
      addMatches,
      addObject,
      clearSearch,
      clearBuffer,
      loadNode,
      loadChildren,
      addNode,
      () => false,
      () => false,
      () => false,
      () => true
    );
    scanForUUID({ barcode: '1234', museumId: new MuseumId(99), collectionId: new CollectionId('1234'), token: '1234'});
    expect(goTo.calledOnce).toBe(true);
    expect(goTo.getCall(0).args[0]).toEqual('/magasin/45');
    expect(showError.calledOnce).toBe(false);
    expect(clearSearch.calledOnce).toBe(false);
    expect(addObject.calledOnce).toBe(false);
    expect(addNode.calledOnce).toBe(false);
    expect(clearBuffer.calledOnce).toBe(true);
    expect(addMatches.calledOnce).toBe(false);
  });

  it('should have a working reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      // console.log(JSON.stringify(actual, null, 2));
      // console.log(JSON.stringify(expected, null, 2));
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    const initialState = { enabled: false, code: '', matches: [] };

    // mock streams
    const clearSearchM       = '---1---------';
    const addMatchesM        = '----1--------';
    const prepareSearchM     = '--1----------';
    const scheduledClearM    = '-------------';
    const scanForUUIDM       = '-------------';
    const toggleEnabledM     = '------1------';
    const clearBufferM       = '-----1-------';
    const keyPressM          = '-------------';
    const appSessionM        = '-1-----------';
    const expected           = 'abcefgh------';

    const expectedStateMap = {
      a: initialState,
      b: {
        ...initialState,
        appSession: {token: '1223', museumId: new MuseumId(99)}
      },
      c: {
        ...initialState,
        appSession: {token: '1223', museumId: new MuseumId(99)},
        searchPending: true,
        searchComplete: false,
        matches: null
      },
      d: {
        ...initialState,
        appSession: {token: '1223', museumId: new MuseumId(99)},
        searchPending: false,
        searchComplete: true,
        matches: [
          {
            id: 456,
            currentLocation: 3,
            term: 'some term',
            museumNo: 'MUS45',
            subNo: '56'
          }
        ]
      },
      e: {
        ...initialState,
        appSession: {token: '1223', museumId: new MuseumId(99)},
        searchPending: false,
        searchComplete: false,
        matches: null
      },
      f: {
        ...initialState,
        appSession: {token: '1223', museumId: new MuseumId(99)},
        searchPending: false,
        searchComplete: true,
        matches: [
          1, 2, 3
        ]
      },
      g: {
        ...initialState,
        buffer: null, code: null, matches: null,
        searchPending: false, searchComplete: false,
        appSession: {token: '1223', museumId: new MuseumId(99)}
      },
      h: {
        ...initialState,
        enabled: true,
        buffer: null, code: null, matches: null,
        searchPending: false, searchComplete: false,
        appSession: {token: '1223', museumId: new MuseumId(99)}
      }
    };

    const clearSearch$ = testScheduler.createHotObservable(clearSearchM);
    const addMatches$ = testScheduler.createHotObservable(addMatchesM, { 1: [1, 2, 3]});
    const keyPress$ = testScheduler.createHotObservable(keyPressM);
    const clearBuffer$ = testScheduler.createHotObservable(clearBufferM);
    const toggleEnabled$ = testScheduler.createHotObservable(toggleEnabledM);
    const scanForUUID$ = testScheduler.createHotObservable(scanForUUIDM);
    const scheduledClear$ = testScheduler.createHotObservable(scheduledClearM);
    const prepareSearch$ = testScheduler.createHotObservable(prepareSearchM);
    const appSession$ = testScheduler.createHotObservable(appSessionM, { 1: { token: '1223', museumId: new MuseumId(99)}});

    const state$ = reducer$({
      keyPress$,
      toggleEnabled$,
      scanForUUID$,
      scheduledClear$,
      appSession$,
      prepareSearch$,
      clearBuffer$,
      clearSearch$,
      addMatches$
    });

    // assertion
    testScheduler.expectObservable(createStore('test', state$, Observable.of(initialState))).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
