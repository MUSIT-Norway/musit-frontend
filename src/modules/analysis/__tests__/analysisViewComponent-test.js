// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import AnalysisViewComponent from '../AnalysisViewComponent';
import { fieldsArray } from '../analysisForm';
import type { Field } from 'forms/form';
import type { FormData } from '../types/form';

declare var describe: any;
declare var it: any;
declare var expect: any;

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
    id: 1,
    name: '3D-skanning, laser'
  },
  {
    category: 8,
    id: 2,
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

const appSession = {
  museumId: 99,
  collectionId: '1234',
  accessToken: '45667',
  actor: {
    fn: 'Test'
  }
};

const form: FormData = (fieldsArray.reduce(
  (acc, field: Field<any>) => ({
    ...acc,
    [field.name]: {
      ...field,
      rawValue: field.mapper.toRaw(field.defaultValue)
    }
  }),
  {}
): any);

describe('AnalysisViewComponent', () => {
  it('should render properly', () => {
    const wrapper = shallow(
      <AnalysisViewComponent
        form={form}
        params={{ analysisId: '45' }}
        appSession={appSession}
        store={store}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
