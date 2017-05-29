// @flow
import React from 'react';
import AnalysisFormComponent, {
  updateFormField,
  updateBooleanField,
  getAnalysisTypeTerm,
  submitForm
} from '../AnalysisFormComponent';
import { fieldsArray } from '../analysisForm';
import type { Field } from 'forms/form';
import type { FormData } from '../types/form';
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

const location = {};

describe('AnalysisFormComponent', () => {
  describe('submitForm', () => {
    it('should add restriction if restriction is set', done => {
      const goTo = sinon.spy();
      const formWithRestrictions: FormData = {
        ...form,
        id: { ...form.id, value: 45 },
        restrictions: { ...form.restrictions, value: true },
        restrictions_requester: { ...form.restrictions_requester, value: 'Test mann' },
        restrictions_reason: { ...form.restrictions_reason, value: 'No reason' },
        restrictions_expirationDate: {
          ...form.restrictions_expirationDate,
          value: '2017-01-01'
        }
      };
      const promise1 = new StatefulPromise();
      const promise2 = new StatefulPromise();
      submitForm(
        appSession,
        formWithRestrictions,
        location,
        promise1.createPromise(),
        promise2.createPromise(),
        goTo
      )({
        preventDefault: identity
      }).then(() => {
        expect(promise1.value.id).toEqual(45);
        expect(promise1.value.token).toEqual('45667');
        expect(promise1.value.museumId).toEqual(99);
        expect(promise1.value.data.restriction).not.toBe(null);
        expect(promise1.value.data.restriction.requester).toBe('Test mann');
        expect(promise1.value.data.restriction.reason).toBe('No reason');
        expect(promise1.value.data.restriction.expirationDate).toBe('2017-01-01');
        done();
      });
    });
  });

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
      const store = { analysis, analysisTypes };
      const term = getAnalysisTypeTerm(store, appSession);
      expect(term).toBe('');
    });

    it('should return empty string if called prematurely', () => {
      const store = {};
      const term = getAnalysisTypeTerm(store, appSession);
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
      const store = { analysis, analysisTypes };
      const term = getAnalysisTypeTerm(store, appSession);
      expect(term).toBe('Tjokkimokki 1');
    });
  });

  describe('updateFormField', () => {
    it('should updateForm with non empty input value', () => {
      const updateForm = sinon.spy();
      updateFormField('someFieldName', updateForm)({ target: { value: 'Test' } });
      expect(updateForm.calledOnce).toBe(true);
      expect(updateForm.getCall(0).args[0].name).toEqual('someFieldName');
      expect(updateForm.getCall(0).args[0].rawValue).toEqual('Test');
    });

    it('should updateForm with empty input value', () => {
      const updateForm = sinon.spy();
      updateFormField('someFieldName', updateForm)({ target: { value: '' } });
      expect(updateForm.calledOnce).toBe(true);
      expect(updateForm.getCall(0).args[0].name).toEqual('someFieldName');
      expect(updateForm.getCall(0).args[0].rawValue).toEqual('');
    });
  });

  describe('updateBooleanField', () => {
    it('should updateForm with true boolean value', () => {
      const updateForm = sinon.spy();
      updateBooleanField(true)('someOtherFieldName', updateForm)();
      expect(updateForm.calledOnce).toBe(true);
      expect(updateForm.getCall(0).args[0].name).toEqual('someOtherFieldName');
      expect(updateForm.getCall(0).args[0].rawValue).toEqual(true);
    });

    it('updateBooleanField should updateForm with false boolean value', () => {
      const updateForm = sinon.spy();
      updateBooleanField(false)('someOtherFieldName', updateForm)();
      expect(updateForm.calledOnce).toBe(true);
      expect(updateForm.getCall(0).args[0].name).toEqual('someOtherFieldName');
      expect(updateForm.getCall(0).args[0].rawValue).toEqual(false);
    });
  });

  it('should render objects from events', () => {
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
      },
      analysisTypes: [],
      analysisTypeCategorie: []
    };

    const wrapper = shallow(
      <AnalysisFormComponent
        appSession={appSession}
        form={form}
        updateForm={identity}
        submitForm={identity}
        goBack={identity}
        goToUrl={identity}
        saveAnalysis={promise}
        saveResult={promise}
        store={store}
        location={location}
      />
    );

    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
