import React from 'react';
import EventsComponent from '../EventsComponent';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

describe('EventsComponent', () => {
  it('should render a table of events', () => {
    const eventsStore = {
      data: [
        {
          type: 'MoveObject',
          eventDate: 'dato 1',
          registeredBy: 'Santa 1',
          note: 'Some note 1'
        },
        {
          type: 'MoveObject',
          eventDate: 'dato 2',
          registeredBy: 'Santa 2',
          note: 'Some note 2'
        },
        {
          type: 'Analyse',
          eventDate: 'dato 3',
          registeredBy: 'Santa 3',
          note: 'Some note 3'
        }
      ],
      currentLocation: {
        breadcrumb: [
          {
            url: '/magasin/1',
            name: 'Museum'
          },
          {
            url: '/magasin/2',
            name: 'Org'
          },
          {
            url: '/magasin/3',
            name: 'Bygg'
          },
          {
            url: '/magasin/4',
            name: 'Rom'
          }
        ]
      },
      object: {
        id: 1,
        uuid: '',
        term: 'Fugl 1',
        museumNo: 'MUSK123',
        subNo: 'PIKACHU 1'
      }
    };
    const wrapper = shallow(<EventsComponent eventsStore={eventsStore} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
