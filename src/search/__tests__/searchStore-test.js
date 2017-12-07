// @flow

import { Observable } from 'rxjs';
import createSearchStore, {
  createStoreWithActions,
  initStoreState,
  defaultActions,
  updatePagination
} from '../searchStore';
import MusitTestScheduler from '../../testutils/MusitTestScheduler';

describe('searchStore', () => {
  describe('store', () => {
    const esResponseRawData = {
      timed_out: false,
      took: 42,
      hits: {
        total: 19,
        max_score: 1,
        hits: [
          {
            _index: 'es_index',
            _type: 'collection',
            _id: 'es_id',
            _score: 1,
            _source: null,
            inner_hits: {}
          }
        ]
      }
    };

    it('should load with init state', done => {
      const { store$ } = createSearchStore(
        'test',
        () => Observable.of(esResponseRawData),
        () => ({})
      );

      store$.subscribe(s => {
        expect(s).toEqual(initStoreState());
        done();
      });
    });

    it('should load response from endpoint', () => {
      const testScheduler = new MusitTestScheduler();

      //prettier-ignore
      const streams = {
        clear:        "-----",
        setLoading:   "--c--",
        search:       "---d-",
        changeQuery:  "-b--e",
        selectPage:   "-----",
        searchResult: "-----",
        expected:     "abcde"
       };

      const expectedStateMap = {
        a: initStoreState(),
        b: { ...initStoreState(), queryParam: { q: 'foo' } },
        c: {
          ...initStoreState(),
          queryParam: { q: 'foo' },
          loading: true,
          pagination: null,
          result: null,
          from: 0,
          limit: 100
        },
        d: {
          ...initStoreState(),
          queryParam: { q: 'foo' },
          loading: false,
          result: esResponseRawData,
          pagination: { currentPage: 1, totalPages: 1, showPages: [1] }
        },
        e: {
          ...initStoreState(),
          queryParam: {},
          loading: false,
          result: esResponseRawData,
          pagination: { currentPage: 1, totalPages: 1, showPages: [1] }
        }
      };

      const clear$ = testScheduler.createHotObservable(streams.clear);
      const setLoading$ = testScheduler.createHotObservable(streams.setLoading);
      const search$ = testScheduler.createHotObservable(streams.search, {
        d: {}
      });
      const changeQuery$ = testScheduler.createHotObservable(streams.changeQuery, {
        b: { name: 'q', value: 'foo' },
        e: { name: 'q', value: '' }
      });
      const selectPage$ = testScheduler.createHotObservable(streams.selectPage);

      const { store$ } = createStoreWithActions(
        'test',
        {
          clear$,
          setLoading$,
          search$,
          changeQuery$,
          selectPage$,
          searchResult$: defaultActions.search$
        },
        () => Observable.of(esResponseRawData),
        () => ({})
      );

      testScheduler.expectObservable(store$).toBe(streams.expected, expectedStateMap);
      testScheduler.flush();
    });
  });

  describe('store -> updatePagination', () => {
    const createResult = total => ({
      timed_out: false,
      took: 12,
      hits: {
        total: total,
        max_score: 0,
        hits: []
      }
    });

    it('empty result', () => {
      const res = updatePagination(createResult(0), 0, 10);
      expect(res).toEqual({
        currentPage: 1,
        totalPages: 0,
        showPages: []
      });
    });

    it('one page', () => {
      const res = updatePagination(createResult(10), 0, 10);
      expect(res).toEqual({
        currentPage: 1,
        totalPages: 1,
        showPages: [1]
      });
    });

    it('two pages with current page is on page one', () => {
      const res = updatePagination(createResult(11), 0, 10);
      expect(res).toEqual({
        currentPage: 1,
        totalPages: 2,
        showPages: [1, 2]
      });
    });

    it('two pages with current page is on page two', () => {
      const res = updatePagination(createResult(11), 10, 10);
      expect(res).toEqual({
        currentPage: 2,
        totalPages: 2,
        showPages: [1, 2]
      });
    });

    it('only show 10 pages', () => {
      const res = updatePagination(createResult(1000), 10, 10);
      expect(res).toEqual({
        currentPage: 2,
        totalPages: 100,
        showPages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      });
    });

    it('only show 10 pages', () => {
      const res = updatePagination(createResult(1000), 100, 10);
      expect(res).toEqual({
        currentPage: 11,
        totalPages: 100,
        showPages: [6, 7, 8, 9, 10]
      });
    });
  });
});
