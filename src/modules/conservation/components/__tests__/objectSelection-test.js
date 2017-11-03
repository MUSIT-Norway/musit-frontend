// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import ObjectSelection from '../objectSelection';
import sinon from 'sinon';

describe('ObjectSelection', () => {
  const mainEvent = [
    {
      objectData: {
        id: 51,
        uuid: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        museumId: 99,
        museumNo: 'MusN11',
        term: 'Solsikke',
        collection: 8,
        materials: [],
        locations: [],
        coordinates: [],
        objectType: 'collection'
      },
      id: 51,
      uuid: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
      museumId: 99,
      museumNo: 'MusN11',
      term: 'Solsikke',
      collection: 8,
      materials: [],
      locations: [],
      coordinates: [],
      objectType: 'collection'
    },
    {
      objectData: {
        id: 54,
        uuid: 'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
        museumId: 99,
        museumNo: 'MusN13',
        term: 'Makrellsopp',
        collection: 6,
        materials: [],
        locations: [],
        coordinates: [],
        objectType: 'collection'
      },
      id: 54,
      uuid: 'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
      museumId: 99,
      museumNo: 'MusN13',
      term: 'Makrellsopp',
      collection: 6,
      materials: [],
      locations: [],
      coordinates: [],
      objectType: 'collection'
    },
    {
      objectData: {
        id: 19,
        uuid: '788136fe-8038-47fc-9c59-9ddb010e0f74',
        museumId: 99,
        museumNo: 'MusN20',
        term: 'Ukjent mygg',
        collection: 2,
        materials: [],
        locations: [],
        coordinates: [],
        objectType: 'collection'
      },
      id: 19,
      uuid: '788136fe-8038-47fc-9c59-9ddb010e0f74',
      museumId: 99,
      museumNo: 'MusN20',
      term: 'Ukjent mygg',
      collection: 2,
      materials: [],
      locations: [],
      coordinates: [],
      objectType: 'collection'
    }
  ];
  const SubEventObjectUUIDs = [
    '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
    'aba6a67c-f742-4a44-b13e-0415ec1abb2a'
  ];
  it('should render ObjectSelection for add and edit', () => {
    const preventDefault = sinon.spy();
    const updateFormCalled = sinon.spy();

    const wrapper = shallow(
      <ObjectSelection
        affectedThingsWithDetailsMainEvent={mainEvent}
        affectedThingsSubEvent={SubEventObjectUUIDs}
        viewMode={false}
        updateForm={updateFormCalled}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    wrapper
      .find('tr')
      .first()
      .simulate('click', { preventDefault });
    expect(updateFormCalled.calledOnce).toBe(false);
  });

  it('should render ObjectSelection as read only', () => {
    const wrapper = shallow(
      <ObjectSelection
        affectedThingsWithDetailsMainEvent={mainEvent}
        affectedThingsSubEvent={SubEventObjectUUIDs}
        viewMode={true}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
