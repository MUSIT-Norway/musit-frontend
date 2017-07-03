// @flow

import type { AnalysisCollectionExtended } from '../analysisEventsStore';
import {
  analysisEventsStore$,
  combineDataSources,
  filterAnalysisEvents,
  getUniqueRegisteredByActors
} from '../analysisEventsStore';
import MusitTestScheduler from '../../../../testutils/MusitTestScheduler';
import type { AnalysisCollection } from 'types/analysis';
declare var describe: any;
declare var it: any;
declare var expect: any;

describe('analysisEventsStore', () => {
  it('should reduce the state from loading and from the api', () => {
    const testScheduler = new MusitTestScheduler();

    const apiResponse: Array<AnalysisCollection> = [
      {
        id: 123,
        analysisTypeId: 12,
        events: []
      }
    ];

    // prettier-ignore
    const streams = {
      filterEvents: "---1",
      loading:      "-1--",
      apiResponse:  "--1-",
      expected:     "abcd"
    };

    const apiResponseMap = {
      '1': apiResponse
    };

    const filterEventsMap = {
      '1': 'Ola Nordmann'
    };

    const expectedStateMap = {
      a: {
        loading: false,
        analysisEvents: [],
        analysisEventsFiltered: [],
        filterEventValue: ''
      },
      b: {
        loading: true,
        analysisEvents: [],
        analysisEventsFiltered: [],
        filterEventValue: ''
      },
      c: {
        loading: false,
        analysisEvents: apiResponse,
        analysisEventsFiltered: apiResponse,
        filterEventValue: ''
      },
      d: {
        loading: false,
        analysisEvents: apiResponse,
        analysisEventsFiltered: [],
        filterEventValue: 'Ola Nordmann'
      }
    };

    const filterEvents$ = testScheduler.createHotObservable(
      streams.filterEvents,
      filterEventsMap
    );
    const setLoading$ = testScheduler.createHotObservable(streams.loading);
    const getAnalysisEvents$ = testScheduler.createHotObservable(
      streams.apiResponse,
      apiResponseMap
    );

    const state$ = analysisEventsStore$({
      setLoading$,
      getAnalysisEvents$,
      filterEvents$
    });

    testScheduler.expectObservable(state$).toBe(streams.expected, expectedStateMap);

    testScheduler.flush();
  });

  describe('getUniqueRegisteredByActors', () => {
    const createEvent = (registeredBy: ?string): AnalysisCollection => ({
      id: 1,
      analysisTypeId: 1,
      events: [],
      registeredBy
    });

    it('should extract unique registered by actor ids', () => {
      const events = [
        createEvent('1'),
        createEvent('1'),
        createEvent('2'),
        createEvent(null)
      ];
      const res = getUniqueRegisteredByActors(events);

      expect(res).toEqual(['1', '2']);
    });

    it('should be empty if input is empty', () => {
      const res = getUniqueRegisteredByActors([]);
      expect(res).toEqual([]);
    });
  });

  describe('combineDataSources', () => {
    const analysisTypes = [
      { id: 1, noName: 'en', enName: 'one', category: '1', name: '1' },
      { id: 2, noName: 'to', enName: 'two', category: '2', name: '2' },
      { id: 3, noName: 'tre', enName: 'three', category: '3', name: '3' }
    ];

    const createEvent = (registeredBy: ?string): AnalysisCollection => ({
      id: 1,
      analysisTypeId: 1,
      events: [],
      registeredBy
    });

    it('should append registeredByName to analysisCollection when it exists', () => {
      const event = createEvent('32');
      const actor = { fn: 'Ola Nordmann', applicationId: '32' };

      const res = combineDataSources([actor], [event], analysisTypes);

      expect(res.length).toBe(1);
      expect(res[0].registeredByName).toBe('Ola Nordmann');
    });

    it('should not registeredByName to analysisCollection when its absent', () => {
      const event = createEvent('33');
      const actor = { fn: 'Tada', applicationId: '44' };

      const res = combineDataSources([actor], [event], analysisTypes);

      expect(res.length).toBe(1);
      expect(res[0].registeredByName).toBeUndefined();
    });

    it('should append analysis types to analysisCollection', () => {
      const event = createEvent('33');
      const actor = { fn: 'Ola Nordmann', applicationId: '32' };

      const res = combineDataSources([actor], [event], analysisTypes);

      expect(res.length).toBe(1);
      expect(res[0].analysisType).toBe(analysisTypes[0]);
    });
  });

  describe('filterAnalysisEvents', () => {
    const createEvent = (
      id: number,
      registeredBy: ?string,
      status: ?number,
      analysisTypeId: ?number
    ): AnalysisCollectionExtended => ({
      id,
      analysisTypeId: 1,
      analysisType: {
        id: 1,
        noName: 'en-tekst',
        enName: 'one-text',
        category: '1',
        name: '1'
      },
      events: [],
      status,
      registeredByName: registeredBy
    });

    const events = [
      createEvent(1, 'Ola Nordmann', 2),
      createEvent(2, 'Ola Nordmann', 3),
      createEvent(3, null, null),
      createEvent(4, 'Kari Traa', 1)
    ];

    it('should not filter if filter input is empty', () => {
      const res = filterAnalysisEvents(events, '');

      expect(res).toBe(events);
    });

    it('should filter on status string', () => {
      //status id with 1. matches both norwegian and english texts
      const res = filterAnalysisEvents(events, 'under');

      expect(res).toEqual([events[3]]);
    });

    it('should filter on registered by name and ignore case', () => {
      const res = filterAnalysisEvents(events, 'KARI t');

      expect(res).toEqual([events[3]]);
    });

    it('should have multiple matcher', () => {
      const res = filterAnalysisEvents(events, 'ola');

      expect(res.length).toBe(2);
    });

    const eventWithAnalysisTypeOne = {
      id: 1,
      analysisTypeId: 1,
      analysisType: {
        id: 1,
        noName: 'en-tekst',
        enName: 'one-text',
        category: '1',
        name: '1'
      },
      events: [],
      status: 1
    };
    const eventWithAnalysisTypeTwo = {
      id: 2,
      analysisTypeId: 2,
      analysisType: {
        id: 2,
        noName: 'to-tekst',
        enName: 'two-text',
        category: '2',
        name: '2'
      },
      events: [],
      status: 1
    };

    it('should filter on en text for analysis type', () => {
      const res = filterAnalysisEvents(
        [eventWithAnalysisTypeOne, eventWithAnalysisTypeTwo],
        'one-text'
      );

      expect(res[0]).toBe(eventWithAnalysisTypeOne);
    });

    it('should filter on no tekst for analysis type', () => {
      const res = filterAnalysisEvents(
        [eventWithAnalysisTypeOne, eventWithAnalysisTypeTwo],
        'en-tekst'
      );

      expect(res[0]).toBe(eventWithAnalysisTypeOne);
    });
  });
});
