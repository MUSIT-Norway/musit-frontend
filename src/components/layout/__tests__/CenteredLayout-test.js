import React from 'react';
import CenteredLayout from '../CenteredLayout';
import { mount } from 'enzyme';

describe('CenteredLayout', () => {
  it('should return a component with a container wrapping the children', () => {
    const Component = () => <span>Hei</span>;
    const wrapper = mount(<CenteredLayout children={<Component />} />);
    expect(wrapper.contains(<div className="container"><Component /></div>)).toBe(true);
  });
});
