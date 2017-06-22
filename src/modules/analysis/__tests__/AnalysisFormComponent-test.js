import React from 'react';
import AnalysisFormComponent from '../AnalysisFormComponent';
import { getAnalysisTypeTerm, submitForm } from '../shared/submit';
import { fieldsArray } from '../analysisForm';
import type { Field } from 'forms/form';
import type { FormData } from '../shared/formType';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';
import StatefulPromise from '../../../testutils/StatefulPromise';
import { appSession } from './../../../testutils/sampleDataForTest';

declare var describe: any;
declare var it: any;
declare var expect: any;

const identity = (i: any): any => i;
const promise = (i: any): any => new Promise(res => res(i));

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

describe('AnalysisFormComponent', () => {
  describe('getAnalysisTypeTerm', () => {
    it('should return empty string if not found', () => {
      const analysis = { id: 1, analysisTypeId: '11134', events: [] };
      const analysisTypes = [
        {
          id: '19934',
          name: 'Tjokkimokki 2',
          category: '5'
        },
        {
          id: '18834',
          name: 'Tjokkimokki 3',
          category: '5'
        },
        {
          id: '12234',
          name: 'Tjokkimokki 1',
          category: '5'
        }
      ];
      const term = getAnalysisTypeTerm(
        analysis.analysisTypeId,
        analysisTypes,
        appSession.language
      );
      expect(term).toBe('');
    });

    it('should return empty string if called prematurely', () => {
      const term = getAnalysisTypeTerm(undefined, [], appSession.language);
      expect(term).toBe('');
    });

    it('should match analysisTypeId with matching analysisType name', () => {
      const analysis = { id: 1, analysisTypeId: 12234, events: [] };
      const analysisTypes = [
        {
          id: 19934,
          noName: 'Tjokkimokki 2',
          category: '5'
        },
        {
          id: 18834,
          noName: 'Tjokkimokki 3',
          category: '5'
        },
        {
          id: 12234,
          noName: 'Tjokkimokki 1',
          category: '5'
        }
      ];
      const term = getAnalysisTypeTerm(
        analysis.analysisTypeId,
        analysisTypes,
        appSession.language
      );
      expect(term).toBe('Tjokkimokki 1');
    });
  });

  it('should render objects from events', () => {
    const location = {};
    const store = {
      analysis: {
        id: 1234,
        analysisTypeId: '1234',
        events: [
          {
            id: 1,
            mainObjectId: 1,
            nodeId: '1234',
            objectId: 1,
            objectType: 'collection',
            objectUUID: 'sdffsdsfsf',
            uuid: 'ddlkjlkjfsdf',
            term: 'saks 1',
            museumNo: 'museumNO',
            subNo: 'subNO'
          },
          {
            id: 2,
            mainObjectId: 1,
            nodeId: '1234',
            objectId: 2,
            objectType: 'collection',
            objectUUID: 'sdffsdsfsf',
            uuid: 'ddlkjlkjfsdf',
            term: 'saks 2',
            museumNo: 'museumNO',
            subNo: 'subNO'
          }
        ]
      }
    };

    const wrapper = shallow(
      <AnalysisFormComponent
        appSession={appSession}
        form={form}
        updateForm={identity}
        submitForm={identity}
        clickCancel={identity}
        updateStringField={identity}
        updateArrayField={identity}
        updateBooleanField={identity}
        clickSave={identity}
        saveAnalysis={promise}
        saveResult={promise}
        store={store}
        location={location}
        predefined={{
          purposes: [],
          analysisTypes: [],
          analysisLabList: [],
          categories: {}
        }}
      />
    );

    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
