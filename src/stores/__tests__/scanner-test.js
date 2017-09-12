import React from 'react';
import wrapWithScanner, {
  charDebouncer$,
  charReducer$,
  initialState,
  makeStream
} from '../scanner';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs/dist/RxStore';

import MusitTestScheduler from '../../testutils/MusitTestScheduler';

describe('scannerWrapper', () => {
  it('should provide toggleScanner to child component', () => {
    const Child = props => <button onClick={() => props.toggleScanner()}>Child</button>;
    const processBarcode = sinon.spy();
    const clearScanner = sinon.spy();
    const source$ = Observable.of('1234');
    const ScannerWrapped = wrapWithScanner(processBarcode, source$, clearScanner)(Child);
    const wrapper = mount(<ScannerWrapped appSession={{}} />);
    expect(processBarcode.calledOnce).toBe(false);
    expect(wrapper.state('scannerEnabled')).toBe(false);
    wrapper.find('button').simulate('click');
    expect(processBarcode.callCount).toBe(1);
    expect(processBarcode.getCall(0).args[0]).toBe('1234');
    expect(wrapper.state('scannerEnabled')).toBe(true);
    wrapper.find('button').simulate('click');
    expect(wrapper.instance().subscription).toBe(null);
    expect(processBarcode.callCount).toBe(1);
    expect(wrapper.state('scannerEnabled')).toBe(false);
    wrapper.find('button').simulate('click');
    expect(wrapper.instance().subscription).not.toBe(null);
    expect(processBarcode.callCount).toBe(2);
    expect(processBarcode.getCall(1).args[0]).toBe('1234');
    expect(wrapper.state('scannerEnabled')).toBe(true);
    wrapper.unmount();
  });
});

describe('scanner', () => {
  it('should increase buffer', () => {
    const testScheduler = new MusitTestScheduler();
    // mock streams
    const debounceM = '---1-------';
    const reducerM = '111--------';
    const expected = '---a-------';

    const expectedStateMap = {
      a: { code: '444', uuid: false, number: true }
    };

    const char$ = testScheduler.createHotObservable(reducerM, { 1: 52 }).map(c => {
      const event = new Event('keypress');
      event.which = c;
      return event;
    });
    const reducer$ = charReducer$(char$);
    const debounceTrigger$ = testScheduler.createHotObservable(debounceM);
    const debouncer$ = charDebouncer$(debounceTrigger$);
    const store = createStore(
      'test',
      Observable.merge(reducer$, debouncer$),
      initialState
    );
    const state$ = makeStream(store);

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
