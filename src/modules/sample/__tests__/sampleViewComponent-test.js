import { mount } from 'enzyme';
import React from 'react';
import SampleViewComponent from '../SampleViewComponent';
import { expect } from 'chai';
import MuseumId from '../../../models/museumId';
import MusitActor from '../../../models/actor';
import { AppSession } from '../../app/appSession';

describe('AnalysisSampleFormPageView', () => {
  it('should display correctly', () => {
    const appSession = new AppSession({
      token: '1234',
      museumId: new MuseumId(99),
      actor: new MusitActor({ dataportenId: '12345', fn: 'Jarl' })
    });

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
          sampleSubType: {
            name: 'sampleSubType',
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
          updateBy: {
            name: 'updateBy',
            defaultValue: 'Arne And'
          },
          updateDate: {
            name: 'updateDate',
            defaultValue: '1998-03-12'
          },
          sampleId: {
            name: 'sampleId',
            defaultValue: '1233'
          }
        }}
      />
    );

    expect(wrapper.find('.container').find('span').text()).to.equal(
      'Lagringskontainer:  Reagensrør'
    );

    expect(wrapper.find('.note').find('span').text()).to.equal('Note:  Heisann');
  });
});
