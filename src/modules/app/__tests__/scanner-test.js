import { TestScheduler, Observable, Subject } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$, scanForNode } from '../scanner';
import { createStore } from 'react-rxjs/dist/RxStore';
import MuseumId from '../../../models/museumId';
const diff = require('deep-diff').diff;
import sinon from 'sinon';

describe('scanner', () => {

  it('should display error when scanning UUID that does not exist', () => {
    const ajaxGet = () => Observable.of({ response:  null });
    const goTo = sinon.spy();
    const showError = sinon.spy();
    const clearSearch = sinon.spy();
    const scanForUUID = scanForNode(ajaxGet, goTo, showError, clearSearch);
    scanForUUID({ uuid: '1234', museumId: new MuseumId(99), token: '1234'});
    expect(goTo.calledOnce).toBe(false);
    expect(showError.calledOnce).toBe(true);
    const errorMsg = showError.getCall(0).args[0].message;
    expect(errorMsg).toEqual('Fant ingen node for 1234');
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

  it('should give error when scanning on non supported page', () => {
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
    expect(errorMsg).toEqual('Kan bare reagere på node fra magasin, node plukkliste eller flyttedialog');
    expect(clearSearch.calledOnce).toBe(true);
    expect(clearBuffer.calledOnce).toBe(false);
    expect(loadNode.calledOnce).toBe(false);
    expect(loadChildren.calledOnce).toBe(false);
    expect(addNode.calledOnce).toBe(false);
  });

  it('testing reducer', () => {
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
    const prepareSearchM     = '--1----------';
    const scheduledClearM    = '-------------';
    const scanForUUIDM       = '-------------';
    const toggleEnabledM     = '-------------';
    const clearBufferM       = '-----1-------';
    const keyPressM          = '-------------';
    const appSessionM        = '-1-----------';
    const expected           = 'abc--f-------';

    const expectedStateMap = {
      a: initialState,
      b: {
        ...initialState,
        appSession: { token: '1223', museumId: new MuseumId(99)}
      },
      c: {
        ...initialState,
        appSession: { token: '1223', museumId: new MuseumId(99)},
        searchPending: true,
        searchComplete: false,
        matches: null
      },
      d: {
        ...initialState,
        appSession: { token: '1223', museumId: new MuseumId(99)},
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
        appSession: { token: '1223', museumId: new MuseumId(99)},
        searchPending: false,
        searchComplete: true,
        matches: {
          id: 3,
          name: 'Test',
          type: 'Room',
          path: ',1,2,3,',
          pathNames: [
            {
              nodeId: 1,
              name: 'Museum'
            },
            {
              nodeId: 2,
              name: 'Building'
            },
            {
              nodeId: 3,
              name: 'Box'
            }
          ],
          breadcrumb: [
            {
              id: 1,
              name: 'Museum',
              url: '/magasin/1'
            },
            {
              id: 2,
              name: 'Building',
              url: '/magasin/2'
            },
            {
              id: 3,
              name: 'Box',
              url: '/magasin/3'
            }
          ]
        }
      },
      f: {
        ...initialState,
        buffer: null, code: null, matches: null,
        searchPending: false, searchComplete: false,
        appSession: {token: '1223', museumId: new MuseumId(99)}
      }
    };

    const clearSearch$ = new Subject();
    const addMatches$ = new Subject();
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