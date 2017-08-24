// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import AnalysisViewComponent from '../AnalysisViewComponent';
import { fieldsArray } from '../analysisForm';
import type { Field } from 'forms/form';
import type { FormData } from '../shared/formType';
import { appSession, analysis, history } from '../../../testutils/sampleDataForTest';

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

form.persons.value = [
  {
    name: 'jarl',
    role: 'responsible'
  },
  {
    name: 'line',
    role: 'creator',
    date: '2017-06-29T07:54:22+00:00'
  }
];

form.restrictions.value = true;
form.restriction.value = {
  requester: '3cbf15cb-8348-4e66-99a4-bc314da57444',
  requesterName: 'Jarl',
  reason: 'fin årsak',
  caseNumbers: ['dddd', '44555', '55555'],
  expirationDate: '2017-03-29T07:54:22+00:00',
  cancelledReason: 'meh'
};

const extraAttributes = [
  {
    attributeKey: 'method',
    attributeType: 'Int',
    attributeValue: 'moro metode'
  }
];

describe('AnalysisViewComponent', () => {
  it('should render properly', () => {
    const wrapper = shallow(
      <AnalysisViewComponent
        form={form}
        store={{ analysis, showCancelDialog: false }}
        extraDescriptionAttributes={extraAttributes}
        extraResultAttributes={{}}
        statusText="Fin status"
        labPlaceText="Fin lab"
        analysisTypeTerm="kul analysetype"
        analysisPurpose="fin purpose"
        objects={objectsData}
        clickEdit={() => {}}
        clickCancel={() => {}}
        appSession={appSession}
        history={history}
        hasRestrictions={true}
        updateRestriction={() => null}
        loadingAnalysis={false}
        cancelRestriction={() => null}
        toggleCancelDialog={() => null}
        isRestrictionValidForCancellation={false}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
