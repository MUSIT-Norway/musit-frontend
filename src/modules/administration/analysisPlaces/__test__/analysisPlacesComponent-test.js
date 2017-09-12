// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import AnalysisPlacesComponent from '../AnalysisPlacesComponent';

describe('AnalysisPlacesComponent', () => {
  it('should render properly', () => {
    const wrapper = shallow(<AnalysisPlacesComponent />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
