import assert from 'assert';
import deepFreeze from 'deep-freeze';
import MuseumId from '../../models/museumId';
import * as actions from '../magasinActions';
import { nodeReducer as reducer, statsReducer } from '../magasinReducers';
import * as types from '../magasinTypes';
import Config from '../../config';
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);

const testRootState = {
  data: [
    {
      id: 1,
      type: 'Building',
      area: 1,
      name: 'B1',
      areaTo: 1,
      groupRead: 'foo',
      height: 1,
      heightTo: 1,
      address: 'Foo street 1, 1234 Bar',
      groupWrite: 'bar'
    }
  ],
  root: {
    data: {}
  }
};
deepFreeze(testRootState);
const testSubRootState = {
  data: [
    {
      id: 2,
      type: 'Room',
      area: 1,
      name: 'R1',
      areaTo: 1,
      groupRead: 'foo',
      height: 1,
      heightTo: 1,
      groupWrite: 'bar'
    },
    {
      id: 3,
      type: 'Room',
      area: 1,
      name: 'R2',
      areaTo: 1,
      groupRead: 'foo',
      height: 1,
      heightTo: 1,
      groupWrite: 'bar'
    }
  ],
  root: {
    data: {
      id: 1,
      type: 'Building',
      area: 1,
      name: 'B1',
      areaTo: 1,
      groupRead: 'foo',
      height: 1,
      heightTo: 1,
      address: 'Foo street 1, 1234 Bar',
      groupWrite: 'bar'
    }
  }
};
deepFreeze(testSubRootState);
const testSubNoRootState = {
  data: [
    {
      id: 2,
      type: 'Room',
      area: 1,
      name: 'R1',
      areaTo: 1,
      groupRead: 'foo',
      height: 1,
      heightTo: 1,
      groupWrite: 'bar'
    },
    {
      id: 3,
      type: 'Room',
      area: 1,
      name: 'R2',
      areaTo: 1,
      groupRead: 'foo',
      height: 1,
      heightTo: 1,
      groupWrite: 'bar'
    }
  ],
  root: {}
};
deepFreeze(testSubNoRootState);


describe('Node reducer', () => {
  it('Initial state is set', () => {
    const state = reducer(testRootState, {});
    assert(state === testRootState);
  });

  it('Clear root', () => {
    const state = reducer(testSubRootState, actions.clearRoot());
    assert(JSON.stringify(state) === JSON.stringify(testSubNoRootState));
  });

  const loadOneState = {
    id: 2,
    name: 'Utviklingsmuseet',
    isPartOf: 1,
    path: ',1,2,',
    pathNames: [
      {
        nodeId: 1,
        name: 'root-node'
      },
      {
        nodeId: 2,
        name: 'Utviklingsmuseet'
      }],
    updatedBy: 123,
    updatedDate: '2016-01-01T00:00:00+00:00',
    type: 'Organisation'
  };

  it('creates LOAD_ONE_SUCCESS when fetching data has been done', () => {
    const id = 2;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(new MuseumId(99))}/${id}`;
    nock('http://localhost')
      .get(url)
      .reply(200, loadOneState);
    const store = mockStore();

    store.dispatch(actions.loadRoot(2, new MuseumId(99)))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });

  it('LOAD_ONE: no action', () => {
    expect(
      reducer(undefined, {})
    ).toMatchSnapshot();
  });

  it('LOAD_ONE: initial action', () => {
    expect(
      reducer(undefined, {
        type: types.LOAD_ONE
      })
    ).toMatchSnapshot();
  });

  it('LOAD_ONE: success action', () => {
    expect(
      reducer(undefined, {
        type: types.LOAD_ONE_SUCCESS,
        result: {
          someField: 1
        }
      })
    ).toMatchSnapshot();
  });

  it('LOAD_ONE: fail action', () => {
    expect(
      reducer(undefined, {
        type: types.LOAD_ONE_FAIL,
        error: Error('LOAD_ONE: has error.')
      })
    ).toMatchSnapshot();
  });

  const loadSeveralChildState = {
    totalMatches: 1,
    matches: [
      {
        id: 3,
        name: 'Forskningens hus',
        isPartOf: 2,
        path: ',1,2,3,',
        type: 'Building',
        updatedBy: 123,
        updatedDate: '2016-01-01T00:00:00+00:00'
      }
    ]
  };
  it('creates LOAD_SEVERAL_SUCCESS when fetching data has been done', () => {
    const url = `${Config.magasin.urls.storagefacility.baseUrl(new MuseumId(99))}/root`;
    nock('http://localhost')
      .get(url)
      .reply(200, loadSeveralChildState);
    const store = mockStore();

    store.dispatch(actions.loadRoot(null, new MuseumId(99)))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });

  it('LOAD_SEVERAL: no action', () => {
    expect(
      reducer(undefined, undefined)
    ).toMatchSnapshot();
  });

  it('LOAD_SEVERAL: initial action', () => {
    expect(
      reducer(undefined, {
        type: types.LOAD_SEVERAL
      })
    ).toMatchSnapshot();
  });

  it('LOAD_SEVERAL: success action', () => {
    expect(
      reducer(undefined, {
        type: types.LOAD_SEVERAL_SUCCESS,
        result: {
          someField: 1
        }
      })
    ).toMatchSnapshot();
  });

  it('LOAD_SEVERAL: fail action', () => {
    expect(
      reducer(undefined, {
        type: types.LOAD_SEVERAL_FAIL,
        error: Error('LOAD_SEVERAL has error.')
      })
    ).toMatchSnapshot();
  });

  it('creates LOAD_SEVERAL_SUCCESS child when fetching data has been done', () => {
    const id = 1;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(new MuseumId(99))}/${id}/children?page=1&limit=25`;
    nock('http://localhost')
      .get(url)
      .reply(200, loadSeveralChildState);
    const store = mockStore();

    return store.dispatch(actions.loadChildren(id, new MuseumId(99)))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });

  it('LOAD_SEVERAL child: no action', () => {
    expect(
      reducer(undefined, undefined)
    ).toMatchSnapshot();
  });

  it('LOAD_SEVERAL child: initial action', () => {
    expect(
      reducer(undefined, {
        type: types.LOAD_SEVERAL
      })
    ).toMatchSnapshot();
  });

  it('LOAD_SEVERAL child: success action', () => {
    expect(
      reducer(undefined, {
        type: types.LOAD_SEVERAL_SUCCESS,
        result: {
          someField: 1
        }
      })
    ).toMatchSnapshot();
  });

  it('LOAD_SEVERAL child: fail action', () => {
    expect(
      reducer(undefined, {
        type: types.LOAD_SEVERAL_FAIL,
        error: Error('LOAD_SEVERAL child has error.')
      })
    ).toMatchSnapshot();
  });

  it('creates DELETE_SUCCESS when fetching data has been done', () => {
    const id = 2;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(new MuseumId(99))}/${id}`;
    nock('http://localhost')
      .del(url)
      .reply(200, {
        message: 'Deleted 1 storage nodes.'
      });
    const store = mockStore();

    return store.dispatch(actions.deleteUnit(2, new MuseumId(99)))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });

  it('DELETE: no action', () => {
    expect(
      reducer(undefined, undefined)
    ).toMatchSnapshot();
  });

  it('DELETE: initial action', () => {
    expect(
      reducer(undefined, {
        type: types.DELETE
      })
    ).toMatchSnapshot();
  });

  it('DELETE: success action', () => {
    expect(
      reducer(undefined, {
        type: types.DELETE_SUCCESS,
        result: {
          someField: 1
        }
      })
    ).toMatchSnapshot();
  });

  it('DELETE: fail action', () => {
    expect(
      reducer(undefined, {
        type: types.DELETE_FAIL,
        error: Error('DELETE has error.')
      })
    ).toMatchSnapshot();
  });
});


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

deepFreeze(initialState);
deepFreeze(nullState);

describe('Stats reducer', () => {
  it('Test the initial state.', () => {
    const newstate = statsReducer(initialState, actions.loadStats(1));
    assert(initialState !== JSON.stringify(newstate));
  });

  it('Test loading stats.', () => {
    const newstate = statsReducer(initialState, { type: 'musit/strageunit-stats/LOAD_STATS' });
    expect(newstate).toMatchSnapshot();
  });

  it('Test success state', () => {
    const newstate = statsReducer(initialState, { type: 'musit/strageunit-stats/LOAD_STATS_SUCCESS' });
    expect(newstate).toMatchSnapshot();
  });

  it('Test failure state', () => {
    const newstate = statsReducer(initialState, { type: 'musit/strageunit-stats/LOAD_STATS_FAILURE' });
    expect(newstate).toMatchSnapshot();
  });

  it('Test clearStats method', () => {
    const newstate = statsReducer(initialState, actions.clearStats());
    expect(newstate).toMatchSnapshot();
  });

  it('creates LOAD_STATS_SUCCESS when fetching data has been done', () => {
    const id = 3;
    const url = `${Config.magasin.urls.thingaggregate.baseUrl(new MuseumId(99))}/storagenodes/${id}/stats`;
    nock('http://localhost')
      .get(url)
      .reply(200, {
        numNodes: 6,
        numObjects: 0,
        totalObjects: 12
      });
    const store = mockStore();

    return store.dispatch(actions.loadStats(3, new MuseumId(99)))
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
        type: types.LOAD_STATS
      })
    ).toMatchSnapshot();
  });

  it('LOAD_STATS: success action', () => {
    expect(
      reducer(undefined, {
        type: types.LOAD_STATS_SUCCESS,
        result: {
          someField: 1
        }
      })
    ).toMatchSnapshot();
  });

  it('LOAD_STATS: fail action', () => {
    expect(
      reducer(undefined, {
        type: types.LOAD_STATS_FAILURE,
        error: Error('LOAD_STATS has some error.')
      })
    ).toMatchSnapshot();
  });

});
