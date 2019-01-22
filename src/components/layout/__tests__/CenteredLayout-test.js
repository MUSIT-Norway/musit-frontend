import React from 'react';
import CenteredLayout from '../CenteredLayout';
import { mount } from 'enzyme';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('CenteredLayout', () => {
  it('should return a component with a container wrapping the children', () => {
    const Component = () => <span>Hei</span>;
    const wrapper = mount(<CenteredLayout children={<Component />} />);
    expect(
      wrapper.contains(
        <div className="container">
          <Component />
        </div>
      )
    ).toBe(true);
  });
});
