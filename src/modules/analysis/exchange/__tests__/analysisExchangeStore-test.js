// @flow
import concat from 'lodash/concat';
import MusitTestScheduler from '../../../../testutils/MusitTestScheduler';
import {
  mapAnalysisStoreToState,
  analysisExchangeStore$,
  importGenericResultHeader,
  initStoreState
} from '../analysisExchangeStore';
import { baseHeader } from '../exchangeTemplate';
import type { AnalysisEvent as Event } from 'types/analysis';
import type { AnalysisStoreState } from '../../analysisStore';
import type { ResultExchangeTemplates } from '../exchangeTemplate';

describe('analysisExchangeStore', () => {
  it('should merge store results', () => {
    const testScheduler = new MusitTestScheduler();
    //prettier-ignore
    const streams = {
      analysisTypes:      "-1-----",
      analysisEventStore: "--12---",
      importResult:       "----1--",
      uploadResultFailed: "-----1-",
      clearStore:         "------1",
      expected:           "abcdefa"
    };

    const analysisStore$ = testScheduler.createHotObservable(streams.analysisEventStore, {
      '1': analysisStoreInitFixture,
      '2': analysisStoreObjectDataFixture
    });

    const importResult$ = testScheduler.createHotObservable(streams.importResult, {
      '1': [expectedTemplateRowForObject]
    });
    const uploadResultFailed$ = testScheduler.createHotObservable(
      streams.uploadResultFailed,
      { '1': ['something went wrong'] }
    );
    const setAnalysisTypes$ = testScheduler.createHotObservable(streams.analysisTypes, {
      '1': [analysisType]
    });
    const clearStore$ = testScheduler.createHotObservable(streams.clearStore);

    const state$ = analysisExchangeStore$(
      {
        importResult$,
        uploadResultFailed$,
        clearStoreAction$: clearStore$,
        setAnalysisTypes$
      },
      analysisStore$
    );

    const headers = concat(baseHeader, importGenericResultHeader);
    const expectedStateMap = {
      a: {
        exportTemplate: [],
        importHeaders: [],
        resultHeaders: [],
        importResult: { rows: [] },
        importErrors: [],
        analysisTypes: [],
        analysisResultType: null
      },
      b: {
        exportTemplate: [],
        importHeaders: [],
        resultHeaders: [],
        importResult: { rows: [] },
        importErrors: [],
        analysisTypes: [analysisType],
        analysisResultType: null
      },
      c: {
        analysis: analysisStoreInitFixture.analysis,
        exportTemplate: [],
        importHeaders: [],
        resultHeaders: [],
        importResult: { rows: [] },
        importErrors: [],
        analysisTypes: [analysisType],
        analysisResultType: null
      },
      d: {
        analysis: analysisStoreObjectDataFixture.analysis,
        exportTemplate: [createAnalysisCollectionRow(1), expectedTemplateRowForObject],
        importHeaders: headers,
        resultHeaders: importGenericResultHeader,
        importResult: { rows: [] },
        importErrors: [],
        analysisTypes: [analysisType],
        analysisResultType: 'GenericResult'
      },
      e: {
        analysis: analysisStoreObjectDataFixture.analysis,
        exportTemplate: [createAnalysisCollectionRow(1), expectedTemplateRowForObject],
        importHeaders: headers,
        resultHeaders: importGenericResultHeader,
        importResult: {
          rows: [
            {
              type: 'collection',
              analysisId: 51,
              objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
              museumNo: 'MusN11',
              subNo: null,
              arkFindingNo: null,
              term: 'Solsikke',
              sampleObjectId: null,
              sampleNum: null,
              sampleId: null,
              sampleType: null,
              resultExternalRef: null,
              resultComment: null
            }
          ]
        },
        importErrors: [],
        analysisTypes: [analysisType],
        analysisResultType: 'GenericResult'
      },
      f: {
        analysis: analysisStoreObjectDataFixture.analysis,
        exportTemplate: [createAnalysisCollectionRow(1), expectedTemplateRowForObject],
        importHeaders: headers,
        resultHeaders: importGenericResultHeader,
        importResult: {
          rows: [
            {
              type: 'collection',
              analysisId: 51,
              objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
              museumNo: 'MusN11',
              subNo: null,
              arkFindingNo: null,
              term: 'Solsikke',
              sampleObjectId: null,
              sampleNum: null,
              sampleId: null,
              sampleType: null,
              resultExternalRef: null,
              resultComment: null
            }
          ]
        },
        importErrors: ['something went wrong'],
        analysisTypes: [analysisType],
        analysisResultType: 'GenericResult'
      }
    };

    testScheduler.expectObservable(state$).toBe(streams.expected, expectedStateMap);
    testScheduler.flush();
  });

  describe('mapAnalysisStoreToState', () => {
    const storeState = () => ({
      ...initStoreState(),
      analysisTypes: [
        {
          id: 15,
          noName: 'no',
          enName: 'en',
          category: 'cat',
          name: 'name',
          extraResultType: 'GenericResult'
        }
      ]
    });

    it('should not create template on store init message', () => {
      const res = mapAnalysisStoreToState(analysisStoreInitFixture, storeState());
      expect(res.exportTemplate).toEqual([]);
    });

    it('should create message when analysis store return analysis of an object', () => {
      const res = mapAnalysisStoreToState(analysisStoreObjectDataFixture, storeState());

      expect(res.exportTemplate).toEqual([
        createAnalysisCollectionRow(1),
        expectedTemplateRowForObject
      ]);
    });

    it('should create message when analysis store return analysis of a sample', () => {
      const res = mapAnalysisStoreToState(analysisStoreSampleDataFixture, storeState());

      // $FlowFixMe | We know that this exist in the test fixtures
      const event: Event = analysisStoreSampleDataFixture.analysis.events[0];
      const analysisResultTemplateRow: ResultExchangeTemplates = {
        type: 'sample',
        analysisId: 51,
        // object
        objectId: event.sampleData
          ? event.sampleData.originatedObjectUuid || 'to_satisfy_flow'
          : 'to_satisfy_flow',
        museumNo: event.objectData ? event.objectData.museumNo : null,
        subNo: event.objectData ? event.objectData.subNo : null,
        arkFindingNo: event.objectData ? event.objectData.arkFindingNo : null,
        term: event.objectData ? event.objectData.term : null,
        // sample
        sampleObjectId: event.sampleData ? event.sampleData.objectId : null,
        sampleNum: event.sampleData ? event.sampleData.sampleNum : null,
        sampleId: event.sampleData ? event.sampleData.sampleId : null,
        sampleType: event.sampleData ? event.sampleData.sampleType : null,
        // results
        resultExternalRef: null,
        resultComment: null
      };
      expect(res.exportTemplate).toHaveLength(2);
      expect(res.exportTemplate[0]).toEqual(createAnalysisCollectionRow(22));
      expect(res.exportTemplate[1]).toEqual(analysisResultTemplateRow);
    });
  });
});

const analysisStoreInitFixture: AnalysisStoreState = {
  analysisTypes: [],
  purposes: [],
  categories: {},
  analysisLabList: [],
  loading: true
};

const analysisStoreObjectDataFixture: AnalysisStoreState = {
  analysisTypes: [],
  purposes: [],
  categories: {},
  analysisLabList: [],
  loading: false,
  analysis: {
    id: 1,
    analysisTypeId: 9,
    registeredBy: '93025486-349f-4e48-9605-7e8d34d7ef51',
    registeredDate: '2017-06-20T10:50:34+00:00',
    result: {
      registeredBy: '93025486-349f-4e48-9605-7e8d34d7ef51',
      registeredDate: '2017-06-20T10:50:34+00:00',
      extRef: [],
      type: 'GenericResult'
    },
    events: [
      {
        id: 51,
        analysisTypeId: 9,
        doneBy: '93025486-349f-4e48-9605-7e8d34d7ef51',
        doneDate: '2017-06-22T12:22:06+00:00',
        responsible: '93025486-349f-4e48-9605-7e8d34d7ef51',
        registeredBy: '93025486-349f-4e48-9605-7e8d34d7ef51',
        registeredDate: '2017-06-20T10:50:34+00:00',
        objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        affectedThing: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        affectedType: 'collection',
        partOf: 1,
        type: 'Analysis',
        objectData: {
          id: 56,
          objectType: 'collection',
          uuid: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
          museumId: 99,
          museumNo: 'MusN11',
          term: 'Solsikke',
          collection: 8,
          materials: [],
          locations: [],
          coordinates: []
        }
      }
    ],
    reason: '2',
    status: 1,
    caseNumbers: [],
    type: 'AnalysisCollection',
    registeredByName: 'Ola Nordmann'
  }
};

const analysisStoreSampleDataFixture: AnalysisStoreState = {
  analysisTypes: [],
  purposes: [],
  categories: {},
  analysisLabList: [],
  loading: false,
  analysis: {
    id: 22,
    analysisTypeId: 15,
    registeredBy: '93025486-349f-4e48-9605-7e8d34d7ef51',
    registeredDate: '2017-06-22T12:22:06+00:00',
    result: {
      registeredBy: '93025486-349f-4e48-9605-7e8d34d7ef51',
      registeredDate: '2017-06-22T12:22:06+00:00',
      extRef: [],
      type: 'GenericResult'
    },
    events: [
      {
        id: 51,
        analysisTypeId: 15,
        doneBy: '93025486-349f-4e48-9605-7e8d34d7ef51',
        doneDate: '2017-06-22T12:22:06+00:00',
        responsible: '93025486-349f-4e48-9605-7e8d34d7ef51',
        registeredBy: '93025486-349f-4e48-9605-7e8d34d7ef51',
        registeredDate: '2017-06-22T12:22:06+00:00',
        affectedThing: 'c71a4198-0063-4bc2-9a48-8b1395f206b3',
        affectedType: 'sample',
        partOf: 22,
        type: 'Analysis',
        sampleData: {
          sampleSubType: '',
          registeredDate: '2017-06-22T12:20:49+00:00',
          hasAnalyse: false,
          id: '',
          doneBy: '93025486-349f-4e48-9605-7e8d34d7ef51',
          date: '',
          details: '',
          breadcrumb: [],
          objectId: 'c71a4198-0063-4bc2-9a48-8b1395f206b3',
          originatedObjectUuid: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
          parentObject: {
            objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
            objectType: 'collection'
          },
          isExtracted: true,
          museumId: 99,
          status: 1,
          sampleNum: 1,
          sampleId: 'prøveId',
          sampleTypeId: 12,
          leftoverSample: 1,
          registeredStamp: {
            user: '93025486-349f-4e48-9605-7e8d34d7ef51',
            date: '2017-06-22T12:20:49+00:00',
            name: 'Ola Nordmann'
          },
          isDeleted: false,
          doneByStamp: { user: '', date: '' },
          responsible: '93025486-349f-4e48-9605-7e8d34d7ef51',
          updatedStamp: { user: '', date: '' },
          uuid: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
          museumNo: 'MusN11',
          term: 'Solsikke',
          collection: 8,
          materials: [],
          locations: [],
          coordinates: []
        }
      }
    ],
    reason: '2',
    status: 1,
    caseNumbers: [],
    type: 'AnalysisCollection',
    registeredByName: 'Ola Nordmann'
  }
};

// $FlowFixMe | We know that this exist in the test fixtures
const event: Event = analysisStoreObjectDataFixture.analysis.events[0];
const expectedTemplateRowForObject: ResultExchangeTemplates = {
  type: 'collection',
  analysisId: event.id,
  // object
  objectId: event.affectedThing,
  museumNo: event.objectData ? event.objectData.museumNo : null,
  subNo: event.objectData ? event.objectData.subNo || null : null,
  arkFindingNo: event.objectData ? event.objectData.arkFindingNo || null : null,
  term: event.objectData ? event.objectData.term : null,
  // sample
  sampleObjectId: null,
  sampleNum: null,
  sampleId: null,
  sampleType: null,
  // results
  resultExternalRef: null,
  resultComment: null
};

const createAnalysisCollectionRow = (id: number) => ({
  type: 'analysis',
  analysisId: id,
  // object
  objectId: null,
  museumNo: null,
  subNo: null,
  arkFindingNo: null,
  term: null,
  // sample
  sampleObjectId: null,
  sampleNum: null,
  sampleId: null,
  sampleType: null,
  // results
  resultExternalRef: null,
  resultComment: null
});

const analysisType = {
  id: 12,
  noName: 'noName',
  enName: 'enName',
  category: 'category',
  name: 'name',
  extraResultType: 'GenericResult'
};
