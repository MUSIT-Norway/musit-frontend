/**
 * Created by steinaol on 06.03.17.
 */
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import SampleFormPageAdd from '../SampleFormAddContainer';


describe('AnalysisSampleFormPageAdd', () => {

  it('should display correctly', () => {
    const wrapper=shallow(<SampleFormPageAdd/>);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
