import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import AnalysisEditComponent, {
  editAnalysisEventLocal,
  goToAnalysis
} from '../AnalysisEditComponent';
import { fieldsArray } from '../analysisForm';
import sinon from 'sinon';

const objectsData = [
  {
    museumNumber: '123',
    subNumber: '12345678911',
    term: 'Spyd',
    uuid: '1cbf15cb-8348-4e66-99a4-bc314da57a42'
  },
  {
    museumNumber: '124',
    subNumber: '12345678912',
    term: 'Beltering',
    uuid: '2cbf15cb-8348-4e66-99a4-bc314da57a42'
  },
  {
    museumNumber: '125',
    subNumber: '12345678913',
    term: 'Øsekar',
    uuid: '3cbf15cb-8348-4e66-99a4-bc314da57a42'
  }
];

const analysisTypes = [
  {
    category: 8,
    id: '1bbf15cb-8348-4e66-99a4-bc314da57a42',
    name: '3D-skanning, laser'
  },
  {
    category: 8,
    id: 'b39399ab-aabd-4ebc-903b-adcf6876a364',
    name: '3D-skanning, strukturert lys'
  }
];

const store = {
  analysisTypes: analysisTypes,
  analysis: { ObjectId: '2cbf15cb-8348-4e66-99a4-bc314da57a42' },
  objectsData: objectsData
};

const param = {
  analysisId: 3
};

const form = fieldsArray.reduce(
  (acc, n) => ({
    ...acc,
    [n.name]: {
      name: n.name,
      rawValue: n.name === 'note' ? 'test note' : n.mapper.toRaw(n.defaultValue)
    }
  }),
  {}
);

const appSession = {
  museumId: 99,
  accessToken: '1234'
};

describe('AnalysisEditComponent', () => {
  it('editAnalysisEventLocal should call editAnalysisEvent', () => {
    const editAnalysisEvent = sinon.spy();
    const myForm = {
      analysisTypeId: {
        name: 'analysisTypeId',
        rawValue: 'b15ee459-38c9-414f-8b54-7c6439b44d3d'
      },
      registeredDate: {
        name: 'registeredDate',
        rawValue: null
      },
      note: {
        name: 'note',
        rawValue: null
      },
      by: {
        name: 'by',
        rawValue: null
      },
      expirationDate: {
        name: 'expirationDate',
        rawValue: null
      },
      caseNumbers: {
        name: 'caseNumbers',
        rawValue: null
      },
      cancelledBy: {
        name: 'cancelledBy',
        rawValue: null
      },
      cancelledReason: {
        name: 'cancelledReason',
        rawValue: null
      },
      reason: {
        name: 'reason',
        rawValue: null
      },
      events: {
        name: 'events',
        rawValue: []
      },
      type: {
        name: 'type',
        rawValue: 'AnalysisCollection' // ??
      }
    };
    editAnalysisEventLocal(appSession, myForm, editAnalysisEvent, param);
    expect(editAnalysisEvent.calledOnce).toBe(true);
    expect(editAnalysisEvent.getCall(0).args[0].museumId).toBe(99);
    expect(editAnalysisEvent.getCall(0).args[0].token).toBe('1234');
    expect(editAnalysisEvent.getCall(0).args[0].data.analysisTypeId).toBe(
      'b15ee459-38c9-414f-8b54-7c6439b44d3d'
    );
  });

  it('Call goToAnalysis.', done => {
    let url;
    const fakeGoTo = goToUrl => url = goToUrl;
    const fakeFn = new Promise(res => res({ id: 2 }));
    const fn = goToAnalysis(fakeFn, appSession, fakeGoTo);
    fn.then(() => {
      expect(url).toBe('/museum/99/collections/undefined/analysis/edit/2');
      done();
    });
  });

  it('should fire updateForm when input is changing', () => {
    const updateForm = sinon.spy();
    const wrapper = mount(
      <AnalysisEditComponent form={form} updateForm={updateForm} store={store} />
    );
    wrapper.find('.note').simulate('change', {
      target: {
        value: 'note changed'
      }
    });
    expect(updateForm.getCall(0).args[0].name).toBe('note');
    expect(updateForm.getCall(0).args[0].rawValue).toBe('note changed');
  });

  it('should render properly', () => {
    const updateForm = sinon.spy();
    const wrapper = shallow(
      <AnalysisEditComponent form={form} updateForm={updateForm} store={store} />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
