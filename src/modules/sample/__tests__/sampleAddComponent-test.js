import { mount } from 'enzyme';
import React from 'react';
import SampleAddComponent from '../SampleAddComponent';
import sinon from 'sinon';
import MuseumId from '../../../models/museumId';
import MusitActor from '../../../models/actor';
import { AppSession } from '../../app/appSession';

describe('AnalysisSampleFormPageAdd', () => {

  it('should display correctly', () => {
    const appSession = new AppSession({
      token: '1234',
      museumId: new MuseumId(99),
      actor: new MusitActor({ dataportenId: '12345', fn: 'Jarl'})
    });
    const updateForm = sinon.spy();
    const wrapper = mount(<SampleAddComponent
      appSession={appSession}
      form={{
        note: {
          name: 'note',
          rawValue: 'Heisann'
        },
        sampleSize: {
          name: 'sampleSize',
          rawValue: '1,23'
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
          name: 'registeredDate',
          rawValue: 'Arne And'
        },
        updateDate: {
          name: 'registeredDate',
          rawValue: '1998-03-12'
        },
        sampleId: {
          name: 'sampleId',
          rawValue: '1233'
        }
      }}
      updateForm={updateForm}
    />);
    wrapper.find('.note').simulate('change', { target: {
      value: 'Heisann'
    }});
    expect(updateForm.getCall(0).args[0].name).toBe('note');
    expect(updateForm.getCall(0).args[0].rawValue).toBe('Heisann');

    wrapper.find('.sampleSize').simulate('change', { target: {
      value: '1,23'
    }});
    expect(updateForm.getCall(1).args[0].name).toBe('sampleSize');
    expect(updateForm.getCall(1).args[0].rawValue).toBe('1,23');

  });
});
