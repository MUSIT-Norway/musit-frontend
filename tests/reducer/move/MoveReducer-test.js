import assert from 'assert'
import deepFreeze from 'deep-freeze'
import suReducer, { moveObject } from '../../../src/reducer/move/index'

const sendToBackend = [
  {
    doneBy: 3,
    items: [1],
    destination: 1
  }
]
const loadingState = {
  loading: true,
  loaded: false
}
const successState = {
  loading: false,
  loaded: true
}
const failureState = {
  loading: false,
  loaded: false
}

deepFreeze(sendToBackend)

describe('MoveReducer', () => {
  it('Call move object', () => {
    assert(sendToBackend !== moveObject(1, [1], 1))
  })

  it('Move object.', () => {
    const newstate = suReducer(loadingState, { type: 'musit/move/object/start' })
    assert(JSON.stringify(newstate) === JSON.stringify(loadingState))
  })

  it('Move object success', () => {
    const newstate = suReducer(successState, { type: 'musit/move/object/succes' })
    assert(JSON.stringify(newstate) === JSON.stringify(successState))
  })

  it('Move object failure', () => {
    const newstate = suReducer(failureState, { type: 'musit/move/object/failure' })
    assert(JSON.stringify(newstate) === JSON.stringify(failureState))
  })

  it('Move node.', () => {
    const newstate = suReducer(loadingState, { type: 'musit/move/node/start' })
    assert(JSON.stringify(newstate) === JSON.stringify(loadingState))
  })

  it('Move node success', () => {
    const newstate = suReducer(successState, { type: 'musit/move/node/succes' })
    assert(JSON.stringify(newstate) === JSON.stringify(successState))
  })

  it('Move node failure', () => {
    const newstate = suReducer(failureState, { type: 'musit/move/node/failure' })
    assert(JSON.stringify(newstate) === JSON.stringify(failureState))
  })
})
