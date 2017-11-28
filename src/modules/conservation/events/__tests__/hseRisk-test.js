// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import HseRisk from '../hseRisk';

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
  hseRisk: {
    note: 'test',
    affectedThings: ['ad1b5287-0168-4343-b3df-a477de113bee']
  },
  index: 1,
  appSession: {
    accessToken: '123',
    actor: {
      fn: 'Rituvesh Kumar'
    },
    groups: [
      {
        id: 99,
        shortName: 'Test',
        museumId: 99,
        museumName: 'Test',
        permission: 10000,
        collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
      }
    ],
    museumId: 99,
    collectionId: '00000000-0000-0000-0000-000000000000',
    buildInfo: {
      commitSha: 'not built on CI'
    },
    language: { isEn: true, isNo: false }
  },
  viewMode: true
};

describe('HseRisk', () => {
  it('should render properly', () => {
    const wrapper = shallow(<HseRisk {...props} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
