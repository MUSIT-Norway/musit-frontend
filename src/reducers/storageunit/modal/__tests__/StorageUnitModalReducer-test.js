import assert from 'assert'
import deepFreeze from 'deep-freeze'

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
})
