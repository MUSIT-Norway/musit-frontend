import React from 'react';
import wrapWithScanner from '../scanner';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Observable } from 'rxjs';
import { AppSession } from '../appSession';

describe('scannerWrapper', () => {
  it('should provide toggleScanner to child component', () => {
    const Child = (props) => <button onClick={() => props.toggleScanner()}>Child</button>;
    const processBarcode = sinon.spy();
    const clearScanner = sinon.spy();
    const unsubscribe = sinon.spy();
    let count = 0;
    const source$ = {
      subscribe: (next) => {
        count++;
        const sub = Observable.of('1234'+count).subscribe(next);
        return {
          unsubscribe: () =>  {
            unsubscribe();
            sub.unsubscribe();
          }
        };
      }
    };
    const ScannerWrapped = wrapWithScanner(processBarcode, source$, clearScanner)(Child);
    const wrapper = mount(<ScannerWrapped appSession={new AppSession({})} />);
    expect(processBarcode.calledOnce).toBe(false);
    expect(wrapper.state('scannerEnabled')).toBe(false);
    wrapper.find('button').simulate('click');
    expect(processBarcode.callCount).toBe(1);
    expect(processBarcode.getCall(0).args[0]).toBe('12341');
    expect(wrapper.state('scannerEnabled')).toBe(true);
    wrapper.find('button').simulate('click');
    expect(unsubscribe.callCount).toBe(1);
    expect(processBarcode.callCount).toBe(1);
    expect(wrapper.state('scannerEnabled')).toBe(false);
    wrapper.find('button').simulate('click');
    expect(unsubscribe.callCount).toBe(2);
    expect(processBarcode.callCount).toBe(2);
    expect(processBarcode.getCall(1).args[0]).toBe('12342');
    expect(wrapper.state('scannerEnabled')).toBe(true);
    wrapper.unmount();
    expect(unsubscribe.callCount).toBe(3);
  });
});