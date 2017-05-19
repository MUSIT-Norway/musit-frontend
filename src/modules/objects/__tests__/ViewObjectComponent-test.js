import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ViewObjectComponent from '../ViewObjectComponent';

describe('ViewObjectComponent', () => {
  it('should display correctly', () => {
    const wrapper = shallow(
      <ViewObjectComponent
        objectStore={{
          objectData: {
            uuid: '22233-4443-222-333',
            museumNo: 'O-L-3444',
            objectType: 'Collection'
          },
          events: [
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
          ],
          samples: [
            {
              doneDate: '1999-01-20',
              sampleTypeId: 1,
              status: 2,
              hasAnalyse: false,
              id: '1233-111-2222-222'
            },
            {
              doneDate: '1999-01-29',
              sampleTypeId: 2,
              status: 24,
              hasAnalyse: true,
              id: '1233-111-2155-222'
            }
          ]
        }}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
