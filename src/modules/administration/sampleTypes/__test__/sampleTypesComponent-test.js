// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import SampleTypesComponent from '../SampleTypesComponent';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('SampleTypesComponent', () => {
  it('should render properly', () => {
    const wrapper = shallow(<SampleTypesComponent />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
