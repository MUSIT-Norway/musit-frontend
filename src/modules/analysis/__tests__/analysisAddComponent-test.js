import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import AnalysisAddComponent, {
  saveAnalysisEventLocal,
  goToAnalysis
} from '../AnalysisAddComponent';
import { fieldsArray } from '../analysisAddForm';
import sinon from 'sinon';
import { Observable } from 'rxjs';

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
  objectsData: objectsData
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

describe('AnalysisAddComponent', () => {
  it('saveAnalysisEventLocal should call saveAnalysisEvent', () => {
    const saveAnalysisEvent = sinon.spy();
    saveAnalysisEventLocal(appSession, form, store, saveAnalysisEvent)(1);
    expect(saveAnalysisEvent.calledOnce).toBe(true);
    expect(saveAnalysisEvent.getCall(0).args[0].museumId).toBe(99);
    expect(saveAnalysisEvent.getCall(0).args[0].token).toBe('1234');
    expect(saveAnalysisEvent.getCall(0).args[0].data.analysisTypeId).toBe(
      'b15ee459-38c9-414f-8b54-7c6439b44d3d'
    );
  });

  it('Call goToAnalysis.', done => {
    const fakeGoTo = sinon.spy();
    const fakeFn = () => Observable.of(null).toPromise();
    const fn = goToAnalysis(fakeFn, appSession, fakeGoTo);
    const analysisId = 2;
    fn(analysisId).then(() => {
      expect(fakeGoTo.calledOnce).toBe(true);
      done();
    });
  });

  it('should fire updateForm when input is changing', () => {
    const updateForm = sinon.spy();
    const wrapper = mount(
      <AnalysisAddComponent form={form} updateForm={updateForm} store={store} />
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
      <AnalysisAddComponent form={form} updateForm={updateForm} store={store} />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
