import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import EventTableComponent from '../components/EventTable';

describe('EventTableComponent', () => {
  it('should render header, body and footer', () => {
    const wrapper = shallow(
      <EventTableComponent
        events={[
          {
            eventDate: '1999-01-20',
            eventType: 'Flytting',
            registeredBy: 'Ole Olsen',
            keyData: 'Til magasin nr 3',
            note: 'Ein kommentar',
            id: '1233-111-2222-222'
          },
          {
            eventDate: '1999-06-20',
            eventType: 'Analyse',
            registeredBy: 'Ole Hansen',
            keyData: 'Acid',
            note: 'Ein kommentar',
            id: '1233-111-2122-222'
          }
        ]}
        analysisTypes={[]}
        sampleTypes={[]}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
