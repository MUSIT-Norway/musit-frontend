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
    const wrapper = shallow(
      <SampleViewComponent
        clickCreateAnalysis={() => () => null}
        clickEditSample={() => () => null}
        store={{
          sample: {}
        }}
        appSession={appSession}
        params={{ sampleId: '0000-1111-2222-3333' }}
        form={{
          note: {
            name: 'note',
            value: 'Heisann'
          },
          size: {
            name: 'size',
            value: '1,23'
          },
          sampleNum: {
            name: 'sampleNum',
            value: 2
          },
          externalId: {
            name: 'externalId',
            value: '123'
          },
          externalIdSource: {
            name: 'externalIdSource',
            value: 'Museum'
          },
          description: {
            name: 'description',
            value: 'Av lær'
          },
          term_species: {
            name: 'term_species',
            value: 'Carex saxatilis'
          },
          sampleType: {
            name: 'sampleType',
            value: 'Vev'
          },
          sizeUnit: {
            name: 'sizeUnit',
            value: 'gr'
          },
          subTypeValue: {
            name: 'subTypeValue',
            value: 'Muskel'
          },
          status: {
            name: 'status',
            value: 'Nyskilt'
          },
          storageMedium: {
            name: 'storageMedium',
            value: 'Etanol'
          },
          createdBy: {
            name: 'createdBy',
            value: '1111-2222-1111-1111'
          },
          leftoverSample: {
            name: 'leftoverSample',
            value: 2
          },
          responsible: {
            name: 'responsible',
            value: '1221-3222-3303-3333'
          },
          museumId: {
            name: 'museumId',
            value: '1233'
          },
          subNo: {
            name: 'subNo',
            value: '322222'
          },
          registeredByName: {
            name: 'registeredBy',
            value: '1233'
          },
          container: {
            name: 'container',
            value: 'Reagensrør'
          },
          registeredDate: {
            name: 'registeredDate',
            value: '1988-12-31'
          },
          updatedByName: {
            name: 'updatedBy',
            value: 'Arne And'
          },
          updatedDate: {
            name: 'updatedDate',
            value: '1998-03-12'
          },
          sampleId: {
            name: 'sampleId',
            value: '1233'
          },
          treatment: {
            name: 'treatment',
            value: '1233'
          },
          persons: {
            name: 'persons',
            value: [{ name: 'Arne And', role: 'creator', date: 1495756800000 }]
          }
        }}
        location={{
          state: [
            {
              term: 'Carex saxatilis',
              museumNo: 'M1234',
              subNo: 'a'
            }
          ]
        }}
      />
    );

    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
