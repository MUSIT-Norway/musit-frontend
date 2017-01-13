import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ReportsOverview from '../ReportsOverview';

describe('Reports overview', () => {
  it('should display correctly', () => {
    const wrapper = shallow(<ReportsOverview />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
