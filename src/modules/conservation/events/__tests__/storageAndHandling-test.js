// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import StorageAndHandling from '../storageAndHandling';

const props: any = {
  affectedThingsWithDetailsMainEvent: [
    {
      objectData: {
        id: 1,
        uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
        museumId: 99,
        museumNo: 'MusK58',
        subNo: '1',
        term: 'Rar dings',
        mainObjectId: 1,
        collection: 1,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      },
      id: 1,
      uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
      museumId: 99,
      museumNo: 'MusK58',
      subNo: '1',
      term: 'Rar dings',
      mainObjectId: 1,
      collection: 1,
      materials: [],
      locations: [],
      coordinates: [],
      isDeleted: false,
      objectType: 'collection'
    }
  ],
  storageAndHandling: {
    note: 'erdgdfgdfgdfgdfgdfgg',
    affectedThings: ['ad1b5287-0168-4343-b3df-a477de113bee'],
    lightAndUvLevel: '3456',
    relativeHumidity: '12',
    temperature: '34',
    actorsAndRoles: []
  },
  index: 0,
  appSession: {
    accessToken: '123',
    actor: {
      fn: 'Rituvesh Kumar',
      email: 'rituvesh.kumar@usit.uio.no',
      dataportenId: '2345',
      dataportenUser: '1234'
    },
    groups: [
      {
        id: 99,
        shortName: 'Test',
        museumId: 99,
        museumName: 'Test',
        permission: 10000,
        collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
      },
      {
        id: 7,
        shortName: 'Kmn',
        museumId: 7,
        museumName: 'Kmn',
        permission: 10000,
        collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
      }
    ],
    museumId: 99,
    collectionId: '00000000-0000-0000-0000-000000000000',
    language: { isEn: false, isNo: true }
  },
  viewMode: true,
  expanded: true
};

describe('StorageAndHandling', () => {
  it('should render properly', () => {
    const wrapper = shallow(<StorageAndHandling {...props} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
