import assert from 'assert'
import deepFreeze from 'deep-freeze'

import * as actions from '../index'
import reducer from '../index'
import Config from '../../../../config'
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);

import suReducer, {
  clearRoot
} from '../index'

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
}
deepFreeze(testRootState)
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
}
deepFreeze(testSubRootState)
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
}
deepFreeze(testSubNoRootState)


describe('StorageUnitModalReducer', () => {
  it('Initial state is set', () => {
    const state = suReducer(testRootState, {})
    assert(state === testRootState)
  })

  it('Clear StorageUnitModalReducer root', () => {
    const state = suReducer(testSubRootState, clearRoot())
    assert(JSON.stringify(state) === JSON.stringify(testSubNoRootState))
  })

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
  }

  it('creates LOAD_ROOT_SUCCESS when fetching data has been done', () => {
    const id = 2
    const url = `${Config.magasin.urls.storagefacility.baseUrl(1)}/${id}`
    nock('http://localhost')
        .get(url)
        .reply(200, loadOneState)
    const store = mockStore()

    return store.dispatch(actions.loadNode(2))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot()
        })
  })

  it('LOAD_ROOT: no action', () => {
    expect(
        reducer(undefined, {})
    ).toMatchSnapshot()
  })

  it('LOAD_ROOT: initial action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_ROOT
        })
    ).toMatchSnapshot()
  })

  it('LOAD_ROOT: success action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_ROOT_SUCCESS,
          result: {
            someField: 1
          }
        })
    ).toMatchSnapshot()
  })

  it('LOAD_ROOT: fail action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_ROOT_FAIL,
          error: Error('LOAD_ROOT: has error.')
        })
    ).toMatchSnapshot()
  })

  const loadSeveralChildState = [
    {
      id: 3,
      name: 'Forskningens hus',
      isPartOf: 2,
      path: ',1,2,3,',
      type: 'Building',
      updatedBy: 123,
      updatedDate: '2016-01-01T00:00:00+00:00'
    }]
  it('creates LOAD_SEVERAL_SUCCESS when fetching data has been done', () => {
    const url = `${Config.magasin.urls.storagefacility.baseUrl(1)}/1`
    nock('http://localhost')
        .get(url)
        .reply(200, loadSeveralChildState)
    const store = mockStore()

    return store.dispatch(actions.loadNode(1))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot()
        })
  })

  it('LOAD_SEVERAL: no action', () => {
    expect(
        reducer(undefined, undefined)
    ).toMatchSnapshot()
  })

  it('LOAD_SEVERAL: initial action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_SEVERAL
        })
    ).toMatchSnapshot()
  })

  it('LOAD_SEVERAL: success action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_SEVERAL_SUCCESS,
          result: {
            someField: 1
          }
        })
    ).toMatchSnapshot()
  })

  it('LOAD_SEVERAL: fail action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_SEVERAL_FAIL,
          error: Error('LOAD_SEVERAL has error.')
        })
    ).toMatchSnapshot()
  })

  it('creates LOAD_SEVERAL_SUCCESS child when fetching data has been done', () => {
    const id = 2;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(1)}/${id}/children`;
    nock('http://localhost')
        .get(url)
        .reply(200, loadSeveralChildState)
    const store = mockStore()

    return store.dispatch(actions.loadChildren(id))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot()
        })
  })

  it('LOAD_SEVERAL child: no action', () => {
    expect(
        reducer(undefined, undefined)
    ).toMatchSnapshot()
  })

  it('LOAD_SEVERAL child: initial action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_SEVERAL
        })
    ).toMatchSnapshot()
  })

  it('LOAD_SEVERAL child: success action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_SEVERAL_SUCCESS,
          result: {
            someField: 1
          }
        })
    ).toMatchSnapshot()
  })

  it('LOAD_SEVERAL child: fail action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_SEVERAL_FAIL,
          error: Error('LOAD_SEVERAL child has error.')
        })
    ).toMatchSnapshot()
  })


  it('SET_CURRENT action', () => {
    expect(
        reducer(loadSeveralChildState, actions.setCurrent(1))
    ).toMatchSnapshot()
  })

  it('CLEAR_CURRENT action', () => {
    expect(
        reducer(loadSeveralChildState, actions.clearCurrent())
    ).toMatchSnapshot()
  })
})
