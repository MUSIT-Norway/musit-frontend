import { mount } from 'enzyme';
import React from 'react';
import SampleAddComponent from '../SampleFormComponent';
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
        store={{
          sampleTypes: {
            Vev: [
              {
                enSampleSubType: 'Woot'
              }
            ]
          }
        }}
        form={{
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
        }}
        updateForm={updateForm}
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
