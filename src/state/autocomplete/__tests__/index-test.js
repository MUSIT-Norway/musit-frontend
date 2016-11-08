import { shallow } from 'enzyme';
import React from 'react';
import autoComplete from '../index';

describe('index', () => {
  it('should export a function that creates a renderable component', () => {
    class Test extends React.Component {
      render() {
        return <span>Hello</span>;
      }
    }
    const Component = autoComplete(
      '/some/url/here?search=%term%'
    )(Test);

    const wrapper = shallow(<Component />);

    expect(wrapper.find(Test).length).toEqual(1);
  });
});