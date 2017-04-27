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
            rawValue: 'Heisann'
          },
          size: {
            name: 'size',
            rawValue: '1,23'
          },
          externalId: {
            name: 'externalId',
            rawValue: '123'
          },
          externalIdSource: {
            name: 'externalIdSource',
            rawValue: 'Museum'
          },
          sampleDescription: {
            name: 'sampleDescription',
            rawValue: 'Av lær'
          },
          term_species: {
            name: 'term_species',
            rawValue: 'Carex saxatilis'
          },
          sampleType: {
            name: 'sampleType',
            rawValue: 'Vev'
          },
          sizeUnit: {
            name: 'sizeUnit',
            rawValue: 'gr'
          },
          sampleSubType: {
            name: 'sampleSubType',
            rawValue: 'Muskel'
          },
          status: {
            name: 'status',
            rawValue: 'Nyskilt'
          },
          storageMedium: {
            name: 'storageMedium',
            rawValue: 'Etanol'
          },
          createdBy: {
            name: 'createdBy',
            rawValue: '1111-2222-1111-1111'
          },
          leftoverSample: {
            name: 'leftoverSample',
            rawValue: '2'
          },
          responsible: {
            name: 'responsible',
            rawValue: '1221-3222-3303-3333'
          },
          museumId: {
            name: 'museumId',
            rawValue: '1233'
          },
          subNo: {
            name: 'subNo',
            rawValue: '322222'
          },
          registeredBy: {
            name: 'registeredBy',
            rawValue: '1233'
          },
          container: {
            name: 'container',
            rawValue: 'Reagensrør'
          },
          registeredDate: {
            name: 'registeredDate',
            rawValue: '1988-12-31'
          },
          updateBy: {
            name: 'updateBy',
            rawValue: 'Arne And'
          },
          updateDate: {
            name: 'updateDate',
            rawValue: '1998-03-12'
          },
          sampleId: {
            name: 'sampleId',
            rawValue: '1233'
          },
          persons: {
            name: 'persons',
            defaultValue: [{ name: 'Arne And', role: 'created', date: '1998-01-2001' }]
          }
        }}
      />
    );

    expect(wrapper.find('.container').find('span').text()).to.equal(
      'Lagringskontainer: Reagensrør'
    );

    expect(wrapper.find('.note').find('span').text()).to.equal('Note: Heisann');
  });
});
