// @flow

import React from 'react';
import { shallow } from 'enzyme';
import ImportVerificationTableComponent from '../ImportVerificationTableComponent';

import type { ResultExchangeTemplates } from '../exchangeTemplate';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('ImportVerificationTableComponent', () => {
  it('should not render table if "results" is empty', () => {
    const Comp = shallow(
      <ImportVerificationTableComponent result={[]} resultHeaders={[]} />
    );

    expect(Comp.find('table').length).toBe(0);
  });

  it('should render table if "result" contains elements', () => {
    const row1: ResultExchangeTemplates = {
      type: 'collection',
      analysisId: 32,
      objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
      museumNo: null,
      subNo: null,
      arkFindingNo: null,
      term: null,
      sampleObjectId: null,
      sampleNum: null,
      sampleId: null,
      sampleType: null,
      resultComment: null,
      resultExternalRef: null
    };
    const row2: ResultExchangeTemplates = {
      type: 'collection',
      analysisId: 32,
      objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd9',
      museumNo: null,
      subNo: null,
      arkFindingNo: null,
      term: null,
      sampleObjectId: null,
      sampleNum: null,
      sampleId: null,
      sampleType: null,
      resultComment: null,
      resultExternalRef: null
    };
    const Comp = shallow(
      <ImportVerificationTableComponent
        result={[row1, row2]}
        resultHeaders={['resultComment', 'resultExternalRef']}
      />
    );

    expect(Comp.find('table').length).toBe(1);
    expect(Comp.find('tbody tr').length).toBe(2);
  });

  it('should render content into row', () => {
    const row: ResultExchangeTemplates = {
      type: 'collection',
      analysisId: 32,
      objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
      museumNo: null,
      subNo: null,
      arkFindingNo: null,
      term: null,
      sampleObjectId: null,
      sampleNum: null,
      sampleId: null,
      sampleType: null,
      resultComment: 'comment',
      resultExternalRef: 'extRef1'
    };
    const Comp = shallow(
      <ImportVerificationTableComponent
        result={[row]}
        resultHeaders={['resultComment', 'resultExternalRef']}
      />
    );

    const rowElement = Comp.find('tbody tr td');
    expect(rowElement.at(0).text()).toEqual('' + row.type);
    expect(rowElement.at(1).text()).toEqual('' + row.analysisId);
    expect(rowElement.at(2).text()).toEqual(row.objectId);
    expect(rowElement.at(3).text()).toEqual(row.resultComment);
    expect(rowElement.at(4).text()).toEqual(row.resultExternalRef);
  });
});
