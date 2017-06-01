import {
  getPersonsFromResponse,
  convertSample,
  loadSample,
  onMount
} from '../sampleViewContainer';
import StatefulPromise from '../../../testutils/StatefulPromise';
import sinon from 'sinon';
import { appSession } from '../../../testutils/sampleDataForTest';

describe('SampleViewContainer', () => {
  const sample = {
    objectId: '1279433c-72cd-41b1-bd01-10f0392ed071',
    originatedObjectUuid: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
    parentObject: {
      objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
      objectType: 'collection'
    },
    isExtracted: true,
    museumId: 99,
    status: 1,
    sampleNum: 1,
    sampleId: 'ssdfsdfdfsdf',
    externalId: { value: 'ddff', source: 'ddddd' },
    sampleTypeId: 2,
    size: { unit: 'mg', value: 1 },
    container: 'Eppendorfrør',
    storageMedium: 'Destillert vann',
    treatment: 'DNAdvance Beckman Coulter',
    leftoverSample: 2,
    description: 'sfsfdsdfsdff',
    note: 'ddddd',
    registeredStamp: {
      user: 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
      name: 'Test user',
      date: 1496217151121
    },
    updatedStamp: {
      user: 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
      name: 'Test user',
      date: 1496233429479
    },
    isDeleted: false
  };
  describe('getPersonsFromResponse', () => {
    it('should return empty array of persons if there is no stamps', () => {
      expect(getPersonsFromResponse({}).length).toBe(0);
    });
    it('should return an array with creator if doneByStamp exists', () => {
      const persons = getPersonsFromResponse({
        doneByStamp: {
          name: 'Test name',
          user: '86f910cf-7b49-4dea-9e34-1f0c51696655',
          date: 1496228695399 // 2017-05-31T13:04:55+02:00
        }
      });
      expect(persons.length).toBe(1);
      expect(persons[0].role).toBe('creator');
      expect(persons[0].uuid).toBe('86f910cf-7b49-4dea-9e34-1f0c51696655');
      expect(persons[0].name).toBe('Test name');
      expect(persons[0].date).toContain('2017-05-31');
    });

    it('should return an array with responsible if responsible exists', () => {
      const persons = getPersonsFromResponse({
        responsible: {
          name: 'Test name',
          user: '86f910cf-7b49-4dea-9e34-1f0c51696655'
        }
      });
      expect(persons.length).toBe(1);
      expect(persons[0].role).toBe('responsible');
      expect(persons[0].uuid).toBe('86f910cf-7b49-4dea-9e34-1f0c51696655');
      expect(persons[0].name).toBe('Test name');
    });
  });

  describe('convertSample', () => {
    it('should tolerate wrong sampleTypeId in response', () => {
      const sampleTypes = { test: { sampleTypeId: 1 } };
      const sample = {
        sampleTypeId: 99999,
        registeredStamp: {
          user: '86f910cf-7b49-4dea-9e34-1f0c51696655',
          name: 'Test name'
        }
      };
      const flattenedSample = convertSample(sampleTypes)(sample);
      expect(flattenedSample).not.toBe(null);
    });
    it('should tolerate limited to no fields in response', () => {
      const sampleTypes = { test: { sampleTypeId: 1 } };
      const sample = {
        sampleTypeId: 1,
        registeredStamp: {
          user: '86f910cf-7b49-4dea-9e34-1f0c51696655',
          name: 'Test name'
        }
      };
      const flattenedSample = convertSample(sampleTypes)(sample);
      expect(flattenedSample).not.toBe(null);
    });
    it('should flatten fields in response', () => {
      const sampleTypes = { test: { sampleTypeId: 2, enSampleType: 'DNA Sumtin' } };
      const flattenedSample = convertSample(sampleTypes)(sample);
      expect(flattenedSample).not.toBe(null);
    });
  });

  describe('onMount', () => {
    it('should call getPredefinedTypes', () => {
      const params = {
        sampleId: 23
      };
      const getSample = sinon.spy();
      const loadForm = sinon.spy();
      const getPredefinedTypes = sinon.spy();
      onMount({ params, getSample, loadForm, getPredefinedTypes, appSession });
      expect(getPredefinedTypes.calledOnce).toBe(true);
      expect(getPredefinedTypes.getCall(0).args[0].token).toEqual(appSession.accessToken);
    });
  });

  describe('loadSample', () => {
    it('should load a converted sample into form', done => {
      const loadForm = sinon.spy();
      const promise = new StatefulPromise();
      const getSample = promise.createPromise(sample);
      const id = 2;
      const museumId = 99;
      const token = 'f7144d5d-732f-487c-b2ef-e895ab5cf163';
      const expectedFormData = [
        { defaultValue: [], name: 'persons' },
        {
          defaultValue: 'Test user',
          name: 'updatedByName'
        },
        { defaultValue: 1496233429479, name: 'updatedDate' },
        {
          defaultValue: 'Test user',
          name: 'registeredByName'
        },
        { defaultValue: 1496217151121, name: 'registeredDate' },
        {
          defaultValue: 'DNA Sumtin',
          name: 'sampleType'
        },
        { defaultValue: 'DNA Sumtin', name: 'subTypeValue' },
        {
          defaultValue: 'ddff',
          name: 'externalId'
        },
        { defaultValue: 'ddddd', name: 'externalIdSource' },
        {
          defaultValue: 1,
          name: 'size'
        },
        { defaultValue: 'mg', name: 'sizeUnit' },
        {
          defaultValue: '1279433c-72cd-41b1-bd01-10f0392ed071',
          name: 'objectId'
        },
        {
          defaultValue: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
          name: 'originatedObjectUuid'
        },
        {
          defaultValue: {
            objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
            objectType: 'collection'
          },
          name: 'parentObject'
        },
        { defaultValue: true, name: 'isExtracted' },
        { defaultValue: 99, name: 'museumId' },
        {
          defaultValue: 1,
          name: 'status'
        },
        { defaultValue: 1, name: 'sampleNum' },
        {
          defaultValue: 'ssdfsdfdfsdf',
          name: 'sampleId'
        },
        { defaultValue: 2, name: 'sampleTypeId' },
        {
          defaultValue: 'Eppendorfrør',
          name: 'container'
        },
        { defaultValue: 'Destillert vann', name: 'storageMedium' },
        {
          defaultValue: 'DNAdvance Beckman Coulter',
          name: 'treatment'
        },
        { defaultValue: 2, name: 'leftoverSample' },
        {
          defaultValue: 'sfsfdsdfsdff',
          name: 'description'
        },
        { defaultValue: 'ddddd', name: 'note' },
        {
          defaultValue: {
            date: 1496217151121,
            name: 'Test user',
            user: 'f7144d5d-732f-487c-b2ef-e895ab5cf163'
          },
          name: 'registeredStamp'
        },
        {
          defaultValue: {
            date: 1496233429479,
            name: 'Test user',
            user: 'f7144d5d-732f-487c-b2ef-e895ab5cf163'
          },
          name: 'updatedStamp'
        },
        { defaultValue: false, name: 'isDeleted' }
      ];
      loadSample(id, museumId, token, getSample, loadForm)({
        sampleTypes: { test: { sampleTypeId: 2, enSampleType: 'DNA Sumtin' } }
      }).then(data => {
        expect(promise.params).toEqual({ id, museumId, token });
        expect(data).toEqual(expectedFormData);
        expect(loadForm.calledOnce).toBe(true);
        expect(loadForm.getCall(0).args[0]).toEqual(expectedFormData);
        done();
      });
    });
  });
});
