import assert from 'assert'

import storageObjectReducer, { LOAD_SEVERAL_SUCCESS } from '../../../../src/reducer/storageobject/grid/index'

const comingFromBackend = [
  {
    id: 1,
    identifier: {
      museumNo: 'C666',
      subNo: '34'
    },
    displayName: 'Øks'
  },
  {
    id: 2,
    identifier: {
      museumNo: 'C666',
      subNo: '31'
    },
    displayName: 'Sverd'
  },
  {
    id: 3,
    identifier: {
      museumNo: 'C666',
      subNo: '38'
    },
    displayName: 'Sommerfugl'
  }
]

describe('StorageUnitReducer', () => {
  it('Initial state is set', () => {
    const state = storageObjectReducer({}, {
      type: LOAD_SEVERAL_SUCCESS,
      result: comingFromBackend
    })
    assert(state.data === comingFromBackend)
  })
})
