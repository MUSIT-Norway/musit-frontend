import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import SampleViewComponent from '../SampleViewComponent';

describe('AnalysisSampleFormPageView', () => {
  it('should display correctly', () => {
    const appSession = {
      token: '1234',
      museumId: 99,
      actor: { dataportenId: '12345', fn: 'Jarl' }
    };

    const sampleStore = {
      sample: {
        note: '23444455555',
        size: {
          unit: 'tonn',
          value: '1,23'
        },
        sampleNum: '12',
        externalId: { value: '1234', source: 'Museum' },
        description: 'description',
        term_species: 'Carex saxatilis',
        sampleType: 'Vev',
        sampleSubType: 'Muskel',
        status: 1,
        statusText: 'Nyskilt',
        storageMedium: 'Etanol',
        createdBy: '1111-2222-1111-1111',
        leftoverSample: 2,
        responsible: '1221-3222-3303-3333',
        museumId: '1233',
        subNo: '322222',
        container: 'Reagensrør',
        sampleId: '1233',
        treatment: '1233',
        parentObject: {
          objectId: '12333',
          objectType: 'collection',
          sampleOrObjectData: {}
        },
        updatedStamp: { name: 'Ole Hansen', date: '1992-01-01' },
        registeredStamp: { name: 'Per Hansen', date: '1992-01-05' }
      }
    };
    const wrapper = shallow(
      <SampleViewComponent
        clickCreateAnalysis={() => () => null}
        clickEditSample={() => () => null}
        clickCreateSample={() => () => null}
        objectStore={{
          objectData: {}
        }}
        sampleStore={sampleStore}
        appSession={appSession}
        match={{ params: { sampleId: '0000-1111-2222-3333' } }}
        objectData={{
          term: 'Carex saxatilis',
          museumNo: 'M1234',
          subNo: 'a'
        }}
        goBack={() => {}}
      />
    );

    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
