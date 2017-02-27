import React from 'react';
import wrapWithScanner from '../scannerWrapper';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Observable } from 'rxjs';

describe('scannerWrapper', () => {
  it('should provide toggleScanner to child component', () => {
    const Child = (props) => <button onClick={props.toggleScanner}>Child</button>;
    const processBarcode = sinon.spy();
    const clearScanner = sinon.spy();
    const unsub = sinon.spy();
    const ScannerWrapped = wrapWithScanner(processBarcode)(Child);
    const wrapper = mount(<ScannerWrapped subscribeToScanner={(next) => {
      const sub = Observable.of('1234').subscribe(next);
      return {
        unsubscribe: () => {
          unsub();
          sub.unsubscribe();
        }
      };
    }} clearScanner={clearScanner} />);
    expect(processBarcode.calledOnce).toBe(false);
    expect(wrapper.state('scannerEnabled')).toBe(false);
    wrapper.find('button').simulate('click');
    expect(processBarcode.callCount).toBe(1);
    expect(processBarcode.getCall(0).args[0]).toBe('1234');
    expect(wrapper.state('scannerEnabled')).toBe(true);
    wrapper.find('button').simulate('click');
    expect(unsub.callCount).toBe(1);
    expect(processBarcode.callCount).toBe(1);
    expect(wrapper.state('scannerEnabled')).toBe(false);
    wrapper.find('button').simulate('click');
    expect(unsub.callCount).toBe(2);
    expect(processBarcode.callCount).toBe(2);
    expect(processBarcode.getCall(1).args[0]).toBe('1234');
    expect(wrapper.state('scannerEnabled')).toBe(true);
    wrapper.unmount();
    expect(unsub.callCount).toBe(3);
  });
});