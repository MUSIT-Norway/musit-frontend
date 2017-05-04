import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import AnalysisAddComponent from '../AnalysisTypesComponent';
import { fieldsArray } from '../analysisTypesForm';
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

describe('AnalysisTypesComponent', () => {
  it('should render properly', () => {
    const updateForm = sinon.spy();
    form.restrictions.value = true;
    form.restrictions.rawValue = true;

    const wrapper = shallow(
      <AnalysisAddComponent
        form={form}
        updateForm={updateForm}
        store={store}
        params={{}}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
