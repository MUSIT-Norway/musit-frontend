import { mount } from 'enzyme';
import React from 'react';
import SampleViewComponent from '../SampleViewComponent';
import { expect } from 'chai';

describe('AnalysisSampleFormPageView', () => {
  it('should display correctly', () => {
    const appSession = {
      token: '1234',
      museumId: 99,
      actor: { dataportenId: '12345', fn: 'Jarl' }
    };
    const wrapper = mount(
      <SampleViewComponent
        appSession={appSession}
        params={{ sampleId: '0000-1111-2222-3333' }}
        form={{
          note: {
            name: 'note',
            defaultValue: 'Heisann'
          },
          size: {
            name: 'size',
            defaultValue: '1,23'
          },
          externalId: {
            name: 'externalId',
            defaultValue: '123'
          },
          externalIdSource: {
            name: 'externalIdSource',
            defaultValue: 'Museum'
          },
          description: {
            name: 'description',
            defaultValue: 'Av lær'
          },
          term_species: {
            name: 'term_species',
            defaultValue: 'Carex saxatilis'
          },
          sampleType: {
            name: 'sampleType',
            defaultValue: 'Vev'
          },
          sizeUnit: {
            name: 'sizeUnit',
            defaultValue: 'gr'
          },
          subTypeValue: {
            name: 'subTypeValue',
            defaultValue: 'Muskel'
          },
          status: {
            name: 'status',
            defaultValue: 'Nyskilt'
          },
          storageMedium: {
            name: 'storageMedium',
            defaultValue: 'Etanol'
          },
          createdBy: {
            name: 'createdBy',
            defaultValue: '1111-2222-1111-1111'
          },
          leftoverSample: {
            name: 'leftoverSample',
            defaultValue: '2'
          },
          responsible: {
            name: 'responsible',
            defaultValue: '1221-3222-3303-3333'
          },
          museumId: {
            name: 'museumId',
            defaultValue: '1233'
          },
          subNo: {
            name: 'subNo',
            defaultValue: '322222'
          },
          registeredBy: {
            name: 'registeredBy',
            defaultValue: '1233'
          },
          container: {
            name: 'container',
            defaultValue: 'Reagensrør'
          },
          registeredDate: {
            name: 'registeredDate',
            defaultValue: '1988-12-31'
          },
          updatedBy: {
            name: 'updatedBy',
            defaultValue: 'Arne And'
          },
          updatedDate: {
            name: 'updatedDate',
            defaultValue: '1998-03-12'
          },
          sampleId: {
            name: 'sampleId',
            defaultValue: '1233'
          },
          treatment: {
            name: 'treatment',
            defaultValue: '1233'
          },
          persons: {
            name: 'persons',
            defaultValue: [{ name: 'Arne And', role: 'created', date: '1998-01-2001' }]
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

    expect(wrapper.find('.container').find('span').text()).to.equal(
      'Lagringskontainer: Reagensrør'
    );

    expect(wrapper.find('.note').find('span').text()).to.equal('Note: Heisann');
  });
});
