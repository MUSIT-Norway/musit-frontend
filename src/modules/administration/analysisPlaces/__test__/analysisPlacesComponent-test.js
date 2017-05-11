// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import AnalysisPlacesComponent from '../AnalysisPlacesComponent';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('AnalysisPlacesComponent', () => {
  it('should render properly', () => {
    const wrapper = shallow(<AnalysisPlacesComponent />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
