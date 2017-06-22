import React from 'react';
import lifeCycle from '../lifeCycle';
import sinon from 'sinon';
import { mount } from 'enzyme';

describe('mount', () => {
  it('should run onMount on componentWillMount', () => {
    const onMount = sinon.spy();
    const Component = () => <span>Hei</span>;
    const MountedComponent = lifeCycle({ onMount })(Component);
    mount(<MountedComponent />);
    expect(onMount.calledOnce).toBe(true);
  });
});
