import React from 'react';
import SamplesForObjectComponent from '../SamplesForObjectComponent';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

describe('SamplesForObject', () => {

  it('should display correctly', () => {


    const data = {
      museumObj: 'MUS-123',
      subNo: 'A1',
      term: 'Carex',
      data: [
        {
          sampleType: 'Frø',
          sampleSubType: 'Rogn',
          status: 2,
          createdDate: '1991-11-11'
        },
        {
          sampleType: 'Vev',
          sampleSubType: 'Blod',
          status: 1,
          createdDate: '1991-11-12'},
        {
          sampleType: 'Tekstil',
          sampleSubType: 'Bomull',
          status: 2,
          createdDate: '2011-11-11'}
      ]
    }

    const wrapper = shallow(<SamplesForObjectComponent
      sampleStore={data}
    />);

    expect(shallowToJson(wrapper)).toMatchSnapshot();


  });
});
