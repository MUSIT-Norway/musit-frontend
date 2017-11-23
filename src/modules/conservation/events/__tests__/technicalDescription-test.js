// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import TechnicalDescription from '../technicalDescription';

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
  technicalDescription: {
    note: 'test',
    affectedThings: ['ad1b5287-0168-4343-b3df-a477de113bee']
  },
  index: 1,
  appSession: {
    accessToken: '2977f4df-dbb3-4499-a769-a8e038dc38c2',
    actor: {
      fn: 'Rituvesh Kumar',
      email: 'rituvesh.kumar@usit.uio.no',
      dataportenId: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      dataportenUser: 'rituvesk@uio.no'
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
      },
      {
        id: 6,
        shortName: 'Tmu',
        museumId: 6,
        museumName: 'Tmu',
        permission: 10000,
        collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
      },
      {
        id: 5,
        shortName: 'Vm',
        museumId: 5,
        museumName: 'Vm',
        permission: 10000,
        collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
      },
      {
        id: 4,
        shortName: 'Nhm',
        museumId: 4,
        museumName: 'Nhm',
        permission: 10000,
        collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
      },
      {
        id: 3,
        shortName: 'Khm',
        museumId: 3,
        museumName: 'Khm',
        permission: 10000,
        collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
      },
      {
        id: 2,
        shortName: 'Um',
        museumId: 2,
        museumName: 'Um',
        permission: 10000,
        collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
      },
      {
        id: 1,
        shortName: 'Am',
        museumId: 1,
        museumName: 'Am',
        permission: 10000,
        collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
      }
    ],
    museumId: 99,
    collectionId: '00000000-0000-0000-0000-000000000000',
    buildInfo: {
      builtAtMillis: '1511339476473',
      name: 'service_auth',
      scalaVersion: '2.11.8',
      buildInfoBuildNumber: '32',
      version: '0.1-SNAPSHOT',
      sbtVersion: '0.13.16',
      commitSha: 'not built on CI',
      builtAtString: '2017-11-22 08:31:16.473'
    },
    language: { isEn: true, isNo: false }
  },
  viewMode: true
};

describe('TechnicalDescription', () => {
  it('should render properly', () => {
    const wrapper = shallow(<TechnicalDescription {...props} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
