import {mount, shallow} from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import AnalysisEditComponent, { saveAnalysisEventLocal } from '../AnalysisEditComponent';
import { fieldsArray } from '../analysisAddForm';
import sinon from 'sinon';
import { AppSession } from '../../app/appSession';
import MuseumId from '../../../models/museumId';

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
  data: {
    analysisTypes: analysisTypes
  },
  objectsData: objectsData
};

const form = fieldsArray.reduce((acc, n) => ({...acc, [n.name]: {
  name: n.name,
  rawValue: n.name === 'note' ? 'test note' : n.mapper.toRaw(n.defaultValue)
}}), {});

describe('AnalysisEditComponent', () => {
  it('saveAnalysisEventLocal should call saveAnalysisEvent', () => {
    const saveAnalysisEvent = sinon.spy();
    const appSession = new AppSession({ museumId: new MuseumId(99), accessToken: '1234' });
    saveAnalysisEventLocal(appSession, form, store, saveAnalysisEvent)();
    expect(saveAnalysisEvent.callCount).toBe(1);
    expect(saveAnalysisEvent.getCall(0).args[0].museumId).toEqual(new MuseumId(99));
    expect(saveAnalysisEvent.getCall(0).args[0].token).toEqual('1234');
  });

  it('should fire updateForm when input is changing', () => {
    const updateForm = sinon.spy();
    const wrapper = mount(<AnalysisEditComponent
      form={form}
      updateForm={updateForm}
      store={store}
    />);
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
    const wrapper = shallow(<AnalysisEditComponent
      form={form}
      updateForm={updateForm}
      store={store}
    />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
