import {
  getPersonsFromResponse,
  convertSample,
  onMount,
  loadSample,
  clickCreateAnalysis,
  clickEditSample
} from '../sampleViewContainer';
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
      const sampleTypes = { sampleTypes: { test: { sampleTypeId: 1 } } };
      const sample = {
        sampleTypeId: 99999,
        registeredStamp: {
          user: '86f910cf-7b49-4dea-9e34-1f0c51696655',
          name: 'Test name'
        }
      };
      const flattenedSample = convertSample(sample, sampleTypes);
      expect(flattenedSample).not.toBe(null);
    });
    it('should tolerate limited to no fields in response', () => {
      const sampleTypes = { sampleTypes: { test: { sampleTypeId: 1 } } };
      const sample = {
        sampleTypeId: 1,
        registeredStamp: {
          user: '86f910cf-7b49-4dea-9e34-1f0c51696655',
          name: 'Test name'
        }
      };
      const flattenedSample = convertSample(sample, sampleTypes);
      expect(flattenedSample).not.toBe(null);
    });
    it('should flatten fields in response', () => {
      const sampleTypes = {
        sampleTypes: { test: { sampleTypeId: 2, enSampleType: 'DNA Sumtin' } }
      };
      const flattenedSample = convertSample(sample, sampleTypes);
      expect(flattenedSample).not.toBe(null);
    });
  });

  describe('clickCreateAnalysis', () => {
    it('should call goTo', () => {
      const objectData = {
        museumNo: 'Dontknow',
        subNo: 'Dontcare',
        term: 'Whatsthis'
      };
      const form = {
        sampleType: {
          value: 'Wierd'
        },
        sampleSubType: {
          value: 'Stuff'
        }
      };
      const goTo = sinon.spy();
      const preventDefault = sinon.spy();
      const event = {
        preventDefault
      };
      clickCreateAnalysis(appSession, sample, form, objectData, goTo)(event);
      expect(preventDefault.calledOnce).toBe(true);
      expect(goTo.calledOnce).toBe(true);
      expect(goTo.getCall(0).args[0].pathname).toEqual(
        '/museum/99/collections/1234/analysis/add'
      );
      expect(goTo.getCall(0).args[0].state).toEqual([
        {
          container: 'Eppendorfrør',
          description: 'sfsfdsdfsdff',
          externalId: { source: 'ddddd', value: 'ddff' },
          isDeleted: false,
          isExtracted: true,
          leftoverSample: 2,
          museumId: 99,
          museumNo: 'Dontknow',
          note: 'ddddd',
          objectId: '1279433c-72cd-41b1-bd01-10f0392ed071',
          originatedObjectUuid: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
          parentObject: {
            objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
            objectType: 'collection'
          },
          registeredStamp: {
            date: 1496217151121,
            name: 'Test user',
            user: 'f7144d5d-732f-487c-b2ef-e895ab5cf163'
          },
          sampleId: 'ssdfsdfdfsdf',
          sampleNum: 1,
          sampleSubType: 'Stuff',
          sampleType: 'Wierd',
          sampleTypeId: 2,
          size: { unit: 'mg', value: 1 },
          status: 1,
          storageMedium: 'Destillert vann',
          subNo: 'Dontcare',
          term: 'Whatsthis',
          treatment: 'DNAdvance Beckman Coulter',
          updatedStamp: {
            date: 1496233429479,
            name: 'Test user',
            user: 'f7144d5d-732f-487c-b2ef-e895ab5cf163'
          }
        }
      ]);
    });
  });

  describe('clickEditSample', () => {
    it('should call goTo', () => {
      const sampleId = 3;
      const objectData = {};
      const goTo = sinon.spy();
      const preventDefault = sinon.spy();
      const event = {
        preventDefault
      };
      clickEditSample(appSession, sampleId, objectData, goTo)(event);
      expect(preventDefault.calledOnce).toBe(true);
      expect(goTo.calledOnce).toBe(true);
      expect(goTo.getCall(0).args[0].pathname).toEqual(
        '/museum/99/collections/1234/analysis/sample/3/edit'
      );
      expect(goTo.getCall(0).args[0].state).toEqual([objectData]);
    });
  });

  describe('loadSample', () => {
    it('should call getSample', () => {
      const id = 3;
      const museumId = 99;
      const token = '1234';
      const getSample = sinon.spy();
      const loadForm = sinon.spy();
      const sampleTypes = {
        sampleTypes: { test: { sampleTypeId: 2, enSampleType: 'DNA Sumtin' } }
      };
      loadSample(id, museumId, token, getSample, loadForm)(sampleTypes);
      expect(getSample.calledOnce).toBe(true);
      expect(getSample.getCall(0).args[0].id).toEqual(id);
      expect(getSample.getCall(0).args[0].museumId).toEqual(museumId);
      expect(getSample.getCall(0).args[0].token).toEqual(token);
      getSample.getCall(0).args[0].onComplete(sample);
      expect(loadForm.calledOnce).toBe(true);
      expect(loadForm.getCall(0).args[0]).not.toBe(null);
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
});
