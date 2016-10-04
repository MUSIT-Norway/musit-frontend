import { assert } from '../../../../setup'
import deepFreeze from 'deep-freeze'
import statsReducer, { loadStats, clearStats } from 'reducer/storageunit/stats'

const initialState = {
  stats: {
    nodes: 1100,
    objects: 2100,
    totalObjects: 3100
  }
}
const nullState = {
  stats: null
}
const loadingState = {
  stats: null,
  loading: true,
  loaded: false
}
const successState = {
  stats: undefined,
  loading: false,
  loaded: true
}
const failureState = {
  stats: null,
  loading: false,
  loaded: false
}

deepFreeze(initialState)
deepFreeze(nullState)

describe('Stats reducer', () => {
  it('Test the initial state.', () => {
    const newstate = statsReducer(initialState, loadStats(1))
    assert(initialState !== JSON.stringify(newstate))
  })

  it('Test loading stats.', () => {
    const newstate = statsReducer(initialState, { type: 'musit/strageunit-stats/LOAD_STATS' })
    assert(JSON.stringify(newstate) === JSON.stringify(loadingState))
  })

  it('Test success state', () => {
    const newstate = statsReducer(initialState, { type: 'musit/strageunit-stats/LOAD_STATS_SUCCESS' })
    assert(JSON.stringify(newstate) === JSON.stringify(successState))
  })

  it('Test failure state', () => {
    const newstate = statsReducer(initialState, { type: 'musit/strageunit-stats/LOAD_STATS_FAILURE' })
    assert(JSON.stringify(newstate) === JSON.stringify(failureState))
  })

  it('Test clearStats method', () => {
    const newstate = statsReducer(initialState, clearStats())
    assert(JSON.stringify(newstate) === JSON.stringify(nullState))
  })
})
