import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import SampleTableComponent from '../sampleTableComponent';
import moment from 'moment';

describe('EventTableComponent', () => {
  it('should render header, body and footer', () => {
    const wrapper = shallow(
      <SampleTableComponent
        samples={[
          {
            doneDate: moment('1999-01-20', 'YYYY-MM-DD'),
            sampleTypeId: 1,
            status: 2,
            hasAnalyse: false,
            id: '1233-111-2222-222'
          },
          {
            doneDate: moment('1999-01-29', 'YYYY-MM-DD'),
            sampleTypeId: 1,
            status: 24,
            hasAnalyse: true,
            id: '1233-111-2155-222'
          }
        ]}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
