// @flow

import { mount } from 'enzyme';
import React from 'react';
import SampleAddComponent from '../SampleFormComponent';
import sinon from 'sinon';
import { appSession } from '../../../testutils/sampleDataForTest';
import { createEnLangAppSessionContext } from '../../../testutils/appSessionContext';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('AnalysisSampleFormPageAdd', () => {
  it('should render with no parent sample object', () => {
    const updateForm = sinon.spy();
    const isFormValid = sinon.spy();
    const sampleTypeDisplayName = sinon.spy();
    const clickBack = sinon.spy();
    const clickSave = sinon.spy();

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
        form={formDefinition}
        parentSample={null}
        updateForm={updateForm}
        clickSave={clickSave}
        appSession={appSession}
        clickBack={clickBack}
        sampleTypeDisplayName={sampleTypeDisplayName}
        isFormValid={isFormValid}
        objectData={{
          id: 123,
          uuid: '0000-0000-123',
          museumId: 99,
          museumNo: 'M1234',
          term: 'Carex saxatilis',
          subNo: 'a',
          objectType: 'collection',
          currentLocation: { pathNames: null },
          objectUUID: '0000-0000-123',
          nodeId: 'blee'
        }}
        predefined={{
          sampleTypes: {},
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
        form={formDefinition}
        parentSample={{
          id: '123',
          uuid: '0000-0000-123',
          objectId: '0000-0000-123',
          originatedObjectUuid: '0000-0000-123',
          museumId: 99,
          status: 1,
          leftoverSample: 1,
          isExtracted: false,
          isDeleted: false,
          sampleTypeId: 1,
          museumNo: 'M1234',
          term: 'Carex saxatilis',
          subNo: 'a',
          objectType: 'collection',
          currentLocation: { pathNames: null },
          parentObject: {
            objectId: '000-0000-0001',
            objectType: 'collection',
            sampleOrObjectData: {}
          },
          registeredDate: 'some date',
          registeredStamp: { user: '000-0000-0001', date: '2017' },
          // updatedStamp: {name: null},
          objectUUID: '0000-0000-123',
          sampleSubType: 'some sub type',
          doneBy: 'none',
          hasAnalyse: false,
          date: 'some date',
          breadcrumb: [],
          details: 'some details',
          nodeId: 'blee',
          sampleNum: 12,
          sampleType: {
            sampleTypeId: 1,
            sampleType: null,
            enSampleType: 'en',
            noSampleType: 'no',
            noSampleSubType: null,
            enSampleSubType: null
          }
        }}
        updateForm={updateForm}
        clickSave={clickSave}
        appSession={appSession}
        clickBack={clickBack}
        sampleTypeDisplayName={sampleTypeDisplayName}
        isFormValid={isFormValid}
        objectData={{
          id: 123,
          uuid: '0000-0000-123',
          museumId: 99,
          museumNo: 'M1234',
          term: 'Carex saxatilis',
          subNo: 'a',
          objectType: 'collection',
          currentLocation: { pathNames: null },
          objectUUID: '0000-0000-123',
          nodeId: 'blee'
        }}
        predefined={{
          sampleTypes: {},
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
    note: {
      name: 'note',
      rawValue: 'Heisann',
      status: {
        valid: true
      }
    },
    size: {
      name: 'size',
      rawValue: '1,23',
      status: {
        valid: true
      }
    },
    externalId: {
      name: 'externalId',
      rawValue: '123',
      status: {
        valid: true
      }
    },
    externalIdSource: {
      name: 'externalIdSource',
      rawValue: 'Museum',
      status: {
        valid: true
      }
    },
    description: {
      name: 'description',
      rawValue: 'Av lær',
      status: {
        valid: true
      }
    },
    term_species: {
      name: 'term_species',
      rawValue: 'Carex saxatilis',
      status: {
        valid: true
      }
    },
    sampleType: {
      name: 'sampleType',
      rawValue: 'Vev',
      status: {
        valid: true
      }
    },
    sizeUnit: {
      name: 'sizeUnit',
      rawValue: 'gr',
      status: {
        valid: true
      }
    },
    sampleSubType: {
      name: 'sampleSubType',
      rawValue: 'Muskel',
      status: {
        valid: true
      }
    },
    status: {
      name: 'status',
      rawValue: 'Nyskilt',
      status: {
        valid: true
      }
    },
    storageMedium: {
      name: 'storageMedium',
      rawValue: 'Etanol',
      status: {
        valid: true
      }
    },
    createdBy: {
      name: 'createdBy',
      rawValue: '1111-2222-1111-1111',
      status: {
        valid: true
      }
    },
    responsible: {
      name: 'responsible',
      rawValue: '1221-3222-3303-3333',
      status: {
        valid: true
      }
    },
    museumId: {
      name: 'museumId',
      rawValue: '1233',
      status: {
        valid: true
      }
    },
    subNo: {
      name: 'subNo',
      rawValue: '322222',
      status: {
        valid: true
      }
    },
    registeredBy: {
      name: 'registeredBy',
      rawValue: '1233',
      status: {
        valid: true
      }
    },
    container: {
      name: 'container',
      rawValue: 'Reagensrør',
      status: {
        valid: true
      }
    },
    leftoverSample: {
      name: 'leftoverSample',
      rawValue: '2',
      status: {
        valid: true
      }
    },
    registeredDate: {
      name: 'registeredDate',
      rawValue: '1988-12-31',
      status: {
        valid: true
      }
    },
    updateBy: {
      name: 'updateBy',
      rawValue: 'Arne And',
      status: {
        valid: true
      }
    },
    updateDate: {
      name: 'updateDate',
      rawValue: '1998-03-12',
      status: {
        valid: true
      }
    },
    sampleId: {
      name: 'sampleId',
      rawValue: '1233',
      status: {
        valid: true
      }
    },
    treatment: {
      name: 'treatment',
      rawValue: '1233',
      status: {
        valid: true
      }
    },
    persons: {
      name: 'persons',
      rawValue: [{ name: 'Arne And', role: 'created', date: '1998-01-2001' }],
      status: {
        valid: true
      }
    }
  };
});
