// @flow
import { mount } from 'enzyme';
import React from 'react';
import SampleAddComponent from '../SampleFormComponent';
import sinon from 'sinon';
import {
  appSession,
  history,
  sample,
  createField
} from '../../../testutils/sampleDataForTest';
import { createEnLangAppSessionContext } from '../../../testutils/appSessionContext';

describe('AnalysisSampleFormPageAdd', () => {
  it('should render with no parent sample object', () => {
    const updateForm = sinon.spy();
    const isFormValid = sinon.spy();
    const sampleTypeDisplayName = sinon.spy();
    const clickBack = sinon.spy();
    const clickSave = sinon.spy();
    const updateSampleType = sinon.spy();

    const wrapper = mount(
      <SampleAddComponent
        store={{
          sampleTypes: {
            Vev: [
              {
                enSampleSubType: 'Woot'
              }
            ]
          }
        }}
        clearForm={() => {}}
        clearSampleResponses={() => {}}
        canEditSampleType={true}
        showSampleSubType={false}
        form={formDefinition}
        putSamplesInPicklist={() => {}}
        updateForm={updateForm}
        clickSave={clickSave}
        appSession={appSession}
        history={history}
        updateSampleType={updateSampleType}
        clickBack={clickBack}
        sampleTypeDisplayName={sampleTypeDisplayName}
        isFormValid={isFormValid}
        objectData={[
          {
            id: 123,
            uuid: '0000-0000-123',
            museumId: 99,
            museumNo: 'M1234',
            term: 'Carex saxatilis',
            subNo: 'a',
            objectType: 'collection',
            currentLocation: { breadcrumb: undefined, pathNames: null },
            objectUUID: '0000-0000-123',
            nodeId: 'blee',
            derivedFrom: sample
          }
        ]}
        predefined={{
          analysisTypes: [],
          purposes: [],
          analysisLabList: [],
          categories: {
            raw: []
          },
          sampleTypes: {
            raw: []
          },
          storageContainers: [],
          storageMediums: [],
          treatments: []
        }}
      />,
      createEnLangAppSessionContext()
    );
    wrapper.find('.note').simulate('change', {
      target: {
        value: 'Bjarne'
      }
    });
    expect(updateForm.getCall(0).args[0].name).toEqual('note');
    expect(updateForm.getCall(0).args[0].rawValue).toEqual('Bjarne');

    wrapper.find('.size').simulate('change', {
      target: {
        value: '5,23'
      }
    });
    expect(updateForm.getCall(1).args[0].name).toEqual('size');
    expect(updateForm.getCall(1).args[0].rawValue).toEqual('5,23');
  });

  it('should render with parent sample object', () => {
    const updateForm = sinon.spy();
    const isFormValid = sinon.spy();
    const sampleTypeDisplayName = sinon.spy();
    const clickBack = sinon.spy();
    const clickSave = sinon.spy();
    const updateSampleType = sinon.spy();

    const wrapper = mount(
      <SampleAddComponent
        store={{
          sampleTypes: {
            Vev: [
              {
                enSampleSubType: 'Woot'
              }
            ]
          }
        }}
        clearForm={() => {}}
        clearSampleResponses={() => {}}
        form={formDefinition}
        updateSampleType={updateSampleType}
        canEditSampleType={true}
        showSampleSubType={false}
        putSamplesInPicklist={() => {}}
        updateForm={updateForm}
        history={history}
        clickSave={clickSave}
        appSession={appSession}
        clickBack={clickBack}
        sampleTypeDisplayName={sampleTypeDisplayName}
        isFormValid={isFormValid}
        objectData={[
          {
            id: 123,
            uuid: '0000-0000-123',
            museumId: 99,
            museumNo: 'M1234',
            term: 'Carex saxatilis',
            subNo: 'a',
            objectType: 'collection',
            currentLocation: { breadcrumb: undefined, pathNames: null },
            objectUUID: '0000-0000-123',
            nodeId: 'blee',
            derivedFrom: sample
          }
        ]}
        predefined={{
          analysisTypes: [],
          purposes: [],
          analysisLabList: [],
          categories: {
            raw: []
          },
          sampleTypes: {
            raw: []
          },
          storageContainers: [],
          storageMediums: [],
          treatments: []
        }}
      />,
      createEnLangAppSessionContext()
    );
    wrapper.find('.note').simulate('change', {
      target: {
        value: 'Bjarne'
      }
    });
    expect(updateForm.getCall(0).args[0].name).toEqual('note');
    expect(updateForm.getCall(0).args[0].rawValue).toEqual('Bjarne');

    wrapper.find('.size').simulate('change', {
      target: {
        value: '5,23'
      }
    });
    expect(updateForm.getCall(1).args[0].name).toEqual('size');
    expect(updateForm.getCall(1).args[0].rawValue).toEqual('5,23');
  });

  const formDefinition = {
    note: createField('note', 'Heisann'),
    size: createField('size', '1,23'),
    externalId: createField('externalId', '123'),
    externalIdSource: createField('externalIdSource', 'Museum'),
    description: createField('description', 'Av lær'),
    term_species: createField('term_species', 'Carex saxatilis'),
    sampleType: createField('sampleType', 'Vev'),
    sizeUnit: createField('sizeUnit', 'gr'),
    sampleSubType: createField('sampleSubType', 'Muskel'),
    status: createField('status', 'Nyskilt'),
    storageMedium: createField('storageMedium', 'Etanol'),
    createdBy: createField('createdBy', '1111-2222-1111-1111'),
    responsible: createField('responsible', '1221-3222-3303-3333'),
    museumId: createField('museumId', '1233'),
    subNo: createField('subNo', '322222'),
    registeredBy: createField('registeredBy', '1233'),
    container: createField('container', 'Reagensrør'),
    leftoverSample: createField('leftoverSample', '2'),
    registeredDate: createField('registeredDate', '1988-12-31'),
    updatedBy: createField('updatedBy', 'some uuid'),
    updatedDate: createField('updatedDate', '1998-03-12'),
    updatedByName: createField('updatedByName', 'Arne And'),
    sampleId: createField('sampleId', '1233'),
    treatment: createField('treatment', '1233'),
    statusText: createField('statusText', 'In progress'),
    sampleNum: createField('sampleNum', 4546),
    doneDate: createField('doneDate', '1998-03-12'),
    hasRestMaterial: createField('hasRestMaterial', 'false'),
    registeredByName: createField('registeredByName', 'Jarl'),
    persons: createField('persons', [
      { uuid: '0000-0000-1234', name: 'Arne And', role: 'created', date: '1998-01-2001' }
    ])
  };
});
