import { assert } from '../../../../test/setup'

import { moveObject } from '../index'

const sendToBackend = [
  {
    doneBy: 3,
    items: [1],
    destination: 1
  }
]


describe('MoveReducer', () => {
  it('Call move object', () => {
    assert(sendToBackend !== moveObject(1, [1], 1))
  })
})
