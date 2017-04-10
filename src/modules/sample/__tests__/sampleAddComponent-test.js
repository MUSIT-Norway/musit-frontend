import { mount } from 'enzyme';
import React from 'react';
import SampleAddComponent from '../SampleAddComponent';
import sinon from 'sinon';
import { expect } from 'chai';

describe('AnalysisSampleFormPageAdd', () => {
  it('should display correctly', () => {
    const appSession = {
      token: '1234',
      museumId: 99,
      actor: { dataportenId: '12345', fn: 'Jarl' }
    };
    const updateForm = sinon.spy();
    const wrapper = mount(
      <SampleAddComponent
        appSession={appSession}
        form={{
          note: {
            name: 'note',
            rawValue: 'Heisann'
          },
          size: {
            name: 'size',
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
          }
        }}
        updateForm={updateForm}
      />
    );
    wrapper.find('.note').simulate('change', {
      target: {
        value: 'Bjarne'
      }
    });
    expect(updateForm.getCall(0).args[0].name).to.equal('note');
    expect(updateForm.getCall(0).args[0].rawValue).to.equal('Bjarne');

    wrapper.find('.size').simulate('change', {
      target: {
        value: '5,23'
      }
    });
    expect(updateForm.getCall(1).args[0].name).to.equal('size');
    expect(updateForm.getCall(1).args[0].rawValue).to.equal('5,23');
  });
});
