import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import AnalysisViewComponent from '../view/AnalysisViewComponent';

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

const analysis = {
  analysisTypeId: '8453873d-227c-4205-a231-bf7e04164fab',
  eventDate: '2017-03-16T14:37:45+00:00',
  id: 2,
  museumNo: 'MusK58',
  note: 'fdsfsd sdsa 2',
  objectId: 'adea8141-8099-4f67-bff9-ea5090e18335',
  partOf: 1,
  registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  registeredByName: 'Rituvesh Kumar',
  registeredDate: '2017-04-03T10:36:34+00:00',
  subNo: '2',
  term: 'Mansjettknapp',
  type: 'Analysis'
};

const store = {
  analysisTypes: analysisTypes,
  objectsData: objectsData,
  analysis: analysis
};

describe('AnalysisViewComponent', () => {
  it('should render properly', () => {
    const wrapper = shallow(<AnalysisViewComponent store={store} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
