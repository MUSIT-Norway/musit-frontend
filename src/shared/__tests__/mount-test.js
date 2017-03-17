import React from 'react';
import mountComponent from '../mount';
import sinon from 'sinon';
import { mount } from 'enzyme';

describe('mount', () => {
  it('should run onMount on componentWillMount', () => {
    const onMount = sinon.spy();
    const Component = () => <span>Hei</span>;
    const MountedComponent = mountComponent(onMount)(Component);
    mount(<MountedComponent />);
    expect(onMount.calledOnce).toBe(true);
  });
});