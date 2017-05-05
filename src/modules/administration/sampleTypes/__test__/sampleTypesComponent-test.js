import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import SampleTypesComponent from '../SampleTypesComponent';

describe('SampleTypesComponent', () => {
  it('should render properly', () => {
    const wrapper = shallow(<SampleTypesComponent />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
