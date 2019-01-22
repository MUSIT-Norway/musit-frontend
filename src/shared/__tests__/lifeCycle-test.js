import React from 'react';
import lifeCycle from '../lifeCycle';
import sinon from 'sinon';
import { mount } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('lifeCycle', () => {
  const Component = () => <span>Hei</span>;

  it('should run onMount on componentWillMount', () => {
    const onMount = sinon.spy();
    const MountedComponent = lifeCycle({ onMount })(Component);
    mount(<MountedComponent />);
    expect(onMount.calledOnce).toBe(true);
  });

  it('should throw an error if lifecycle receives a function', () => {
    const returnError = () => {
      try {
        lifeCycle(() => {})(Component);
      } catch (err) {
        return err;
      }
      return null;
    };

    expect(returnError()).not.toEqual(null);
  });
});
