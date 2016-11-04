import assert from 'assert';
import deepFreeze from 'deep-freeze';
import statsReducer, { loadStats, clearStats } from '../index';

import * as actions from '../index';
import reducer from '../index';
import Config from '../../../../config';
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);

const initialState = {
  stats: {
    nodes: 1100,
    objects: 2100,
    totalObjects: 3100
  }
};
const nullState = {
  stats: null
};
const loadingState = {
  stats: null,
  loading: true,
  loaded: false
};
const successState = {
  stats: undefined,
  loading: false,
  loaded: true
};
const failureState = {
  stats: null,
  loading: false,
  loaded: false
};

deepFreeze(initialState);
deepFreeze(nullState);

describe('Stats reducer', () => {
  it('Test the initial state.', () => {
    const newstate = statsReducer(initialState, loadStats(1));
    assert(initialState !== JSON.stringify(newstate));
  });

  it('Test loading stats.', () => {
    const newstate = statsReducer(initialState, { type: 'musit/strageunit-stats/LOAD_STATS' });
    assert(JSON.stringify(newstate) === JSON.stringify(loadingState));
  });

  it('Test success state', () => {
    const newstate = statsReducer(initialState, { type: 'musit/strageunit-stats/LOAD_STATS_SUCCESS' });
    assert(JSON.stringify(newstate) === JSON.stringify(successState));
  });

  it('Test failure state', () => {
    const newstate = statsReducer(initialState, { type: 'musit/strageunit-stats/LOAD_STATS_FAILURE' });
    assert(JSON.stringify(newstate) === JSON.stringify(failureState));
  });

  it('Test clearStats method', () => {
    const newstate = statsReducer(initialState, clearStats());
    assert(JSON.stringify(newstate) === JSON.stringify(nullState));
  });

  it('creates LOAD_STATS_SUCCESS when fetching data has been done', () => {
    const id = 3;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(1)}/${id}/stats`;
    nock('http://localhost')
        .get(url)
        .reply(200, {
          numNodes: 6,
          numObjects: 0,
          totalObjects: 12
        });
    const store = mockStore();

    return store.dispatch(actions.loadStats(3))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
  });

  it('LOAD_STATS: no action', () => {
    expect(
        reducer(undefined, undefined)
    ).toMatchSnapshot();
  });

  it('LOAD_STATS: initial action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_STATS
        })
    ).toMatchSnapshot();
  });

  it('LOAD_STATS: success action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_STATS_SUCCESS,
          result: {
            someField: 1
          }
        })
    ).toMatchSnapshot();
  });

  it('LOAD_STATS: fail action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_STATS_FAILURE,
          error: Error('LOAD_STATS has some error.')
        })
    ).toMatchSnapshot();
  });

});
