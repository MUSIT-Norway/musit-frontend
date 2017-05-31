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
            registeredDate: moment('1999-01-20', 'YYYY-MM-DD').format('DD.MM.YYYY'),
            sampleTypeId: 1,
            status: 2,
            hasAnalyse: false,
            id: '1233-111-2222-222'
          },
          {
            registeredDate: moment('1999-01-29', 'YYYY-MM-DD').format('DD.MM.YYYY'),
            sampleTypeId: 1,
            status: 24,
            hasAnalyse: true,
            id: '1233-111-2155-222'
          }
        ]}
        onClick={a => a}
        pickObject={a => a}
        isItemAdded={a => a}
        pickList={[]}
        appSession={[]}
        objectData={[]}
        sampleTypes={[]}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
