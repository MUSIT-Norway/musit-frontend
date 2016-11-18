import assert from 'assert';
import deepFreeze from 'deep-freeze';

import * as actions from '../index';
import reducer from '../index';
import Config from '../../../../config';
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);


import suReducer, {
  clearRoot
} from '../index';

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


describe('StorageUnitReducer', () => {
  it('Initial state is set', () => {
    const state = suReducer(testRootState, {});
    assert(state === testRootState);
  });

  it('Clear root', () => {
    const state = suReducer(testSubRootState, clearRoot());
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
    const url = `${Config.magasin.urls.storagefacility.baseUrl(99)}/${id}`;
    nock('http://localhost')
      .get(url)
      .reply(200, loadOneState);
    const store = mockStore();

    store.dispatch(actions.loadRoot(2))
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
        type: actions.LOAD_ONE
      })
    ).toMatchSnapshot();
  });

  it('LOAD_ONE: success action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_ONE_SUCCESS,
        result: {
          someField: 1
        }
      })
    ).toMatchSnapshot();
  });

  it('LOAD_ONE: fail action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_ONE_FAIL,
        error: Error('LOAD_ONE: has error.')
      })
    ).toMatchSnapshot();
  });

  const loadSeveralChildState = [
    {
      id: 3,
      name: 'Forskningens hus',
      isPartOf: 2,
      path: ',1,2,3,',
      type: 'Building',
      updatedBy: 123,
      updatedDate: '2016-01-01T00:00:00+00:00'
    }];
  it('creates LOAD_SEVERAL_SUCCESS when fetching data has been done', () => {
    const url = `${Config.magasin.urls.storagefacility.baseUrl(99)}/root`;
    nock('http://localhost')
      .get(url)
      .reply(200, loadSeveralChildState);
    const store = mockStore();

    store.dispatch(actions.loadRoot())
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
        type: actions.LOAD_SEVERAL
      })
    ).toMatchSnapshot();
  });

  it('LOAD_SEVERAL: success action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_SEVERAL_SUCCESS,
        result: {
          someField: 1
        }
      })
    ).toMatchSnapshot();
  });

  it('LOAD_SEVERAL: fail action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_SEVERAL_FAIL,
        error: Error('LOAD_SEVERAL has error.')
      })
    ).toMatchSnapshot();
  });

  it('creates LOAD_SEVERAL_SUCCESS child when fetching data has been done', () => {
    const id = 1;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(99)}/${id}/children`;
    nock('http://localhost')
      .get(url)
      .reply(200, loadSeveralChildState);
    const store = mockStore();

    return store.dispatch(actions.loadChildren(id))
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
        type: actions.LOAD_SEVERAL
      })
    ).toMatchSnapshot();
  });

  it('LOAD_SEVERAL child: success action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_SEVERAL_SUCCESS,
        result: {
          someField: 1
        }
      })
    ).toMatchSnapshot();
  });

  it('LOAD_SEVERAL child: fail action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_SEVERAL_FAIL,
        error: Error('LOAD_SEVERAL child has error.')
      })
    ).toMatchSnapshot();
  });

  it('creates DELETE_SUCCESS when fetching data has been done', () => {
    const id = 2;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(99)}/${id}`;
    nock('http://localhost')
      .del(url)
      .reply(200, {
        message: 'Deleted 1 storage nodes.'
      });
    const store = mockStore();

    return store.dispatch(actions.deleteUnit(2))
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
        type: actions.DELETE
      })
    ).toMatchSnapshot();
  });

  it('DELETE: success action', () => {
    expect(
      reducer(undefined, {
        type: actions.DELETE_SUCCESS,
        result: {
          someField: 1
        }
      })
    ).toMatchSnapshot();
  });

  it('DELETE: fail action', () => {
    expect(
      reducer(undefined, {
        type: actions.DELETE_FAIL,
        error: Error('DELETE has error.')
      })
    ).toMatchSnapshot();
  });
});
