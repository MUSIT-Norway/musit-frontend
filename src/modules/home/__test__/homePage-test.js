import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { HomePage } from '../HomePage';

describe('HomePage', () => {
  it('should render HomePage', () => {
    const wrapper = shallow(<HomePage />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
