import drop from 'lodash/drop'
import moment from 'moment'
import assert from 'assert'
import observationReducer, {
  loadObservation,
  initialState
} from '../index'
import mapToFrontEnd from '../mapper/to_frontend'
import mapToBackEnd from '../mapper/to_backend'
import { parseISODateNonStrict as parseISODate } from '../../../util'

describe('ObservationReducer', () => {
  it('Initial state is set', () => {
    const state = observationReducer()
    assert(state === initialState)
  })

  it('load observation should update state', () => {
    const state = observationReducer(initialState, loadObservation(1))
    assert(state.data.observations.length === 0)
  })

  it('mapToFrontEnd and mapToBackEnd shoud be inverse functions', () => {
    const frontEnd = {
      doneBy: { id: '1' },
      doneDate: parseISODate('2016-09-07'),
      observations: [
        {
          type: 'hypoxicAir',
          data: {
            fromValue: '19',
            toValue: '23',
            commentValue: 'Test comments.'
          }
        },
        {
          type: 'cleaning',
          data: {
            leftValue: 'Test cleaning value.',
            rightValue: 'Test comments.'
          }
        }
      ]
    }
    const thereAndBackAgain = mapToFrontEnd(mapToBackEnd(frontEnd))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontEnd.doneDate, 'year'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontEnd.doneDate, 'month'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontEnd.doneDate, 'day'))
    assert.deepEqual(drop(thereAndBackAgain, 'doneDate'), drop(frontEnd, 'doneDate'))
  })

  it('Valid action from calling actor service for finding actor should update state correctly', () => {
    const actionResult = {
      data: {
        id: 1,
        fn: 'Arne And1'
      },
      type: 'LOAD_ACTOR_SUCCESS'
    }

    const state = observationReducer(initialState, actionResult)
    assert(state.type !== 'LOAD_ACTOR_SUCCESS' || state.data.fn === 'Arne And1')
  })

  it('test alcohol status: Uttørket', () => {
    const frontend = {
      doneBy: { id: '1' },
      doneDate: moment(),
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'Uttørket',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    }
    const thereAndBackAgain = mapToFrontEnd(mapToBackEnd(frontend))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'year'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'month'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'day'))
    assert.deepEqual(drop(thereAndBackAgain, 'doneDate'), drop(frontend, 'doneDate'))
  })

  it('test alcohol status: nesten uttørket', () => {
    const frontend = {
      doneBy: { id: '1' },
      doneDate: moment(),
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'nesten uttørket',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    }
    const thereAndBackAgain = mapToFrontEnd(mapToBackEnd(frontend))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'year'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'month'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'day'))
    assert.deepEqual(drop(thereAndBackAgain, 'doneDate'), drop(frontend, 'doneDate'))
  })

  it('test alcohol status: litt uttørket', () => {
    const frontend = {
      doneBy: { id: '1' },
      doneDate: moment(),
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'litt uttørket',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    }
    const thereAndBackAgain = mapToFrontEnd(mapToBackEnd(frontend))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'year'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'month'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'day'))
    assert.deepEqual(drop(thereAndBackAgain, 'doneDate'), drop(frontend, 'doneDate'))
  })

  it('test alcohol status: noe uttørket', () => {
    const frontend = {
      doneBy: { id: '1' },
      doneDate: moment(),
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'noe uttørket',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    }
    const thereAndBackAgain = mapToFrontEnd(mapToBackEnd(frontend))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'year'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'month'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'day'))
    assert.deepEqual(drop(thereAndBackAgain, 'doneDate'), drop(frontend, 'doneDate'))
  })

  it('test alcohol status: tilfredsstillende', () => {
    const frontend = {
      doneBy: { id: '1' },
      doneDate: moment(),
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'tilfredsstillende',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    }
    const thereAndBackAgain = mapToFrontEnd(mapToBackEnd(frontend))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'year'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'month'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'day'))
    assert.deepEqual(drop(thereAndBackAgain, 'doneDate'), drop(frontend, 'doneDate'))
  })

  it('test invalid alcohol status', () => {
    const frontend = {
      doneBy: { id: '1' },
      doneDate: moment(),
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'xxxddudyudydydydydyd',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    }
    const thereAndBackAgain = mapToFrontEnd(mapToBackEnd(frontend))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'year'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'month'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'day'))
    assert.deepEqual(drop(thereAndBackAgain, 'doneDate'), drop(frontend, 'doneDate'))
  })

  it('mapToFrontEnd and mapToBackEnd are inverse with complete data', () => {
    const frontend = {
      doneBy: { id: '1' },
      doneDate: moment(),
      observations: [
        {

          type: 'lightCondition',
          data: {
            leftValue: 'Mørkst',
            rightValue: 'Altfor mørkt'
          }
        },
        {

          type: 'gas',
          data: {
            leftValue: 'Vannskade',
            rightValue: 'Altfor vått'
          }
        },
        {

          type: 'alcohol',
          data: {
            statusValue: 'Uttørket',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        },
        {

          type: 'mold',
          data: {
            leftValue: 'Muggent',
            rightValue: 'Altfor mye mugg'
          }
        },
        {

          type: 'cleaning',
          data: {
            leftValue: 'Urent',
            rightValue: 'Altfor lyst'
          }
        },
        {

          type: 'brannsikring',
          data: {
            leftValue: 'Brann',
            rightValue: 'Altfor vått'
          }
        },
        {

          type: 'skallsikring',
          data: {
            leftValue: 'skall',
            rightValue: 'Altfor skallet'
          }
        },
        {

          type: 'tyverisikring',
          data: {
            leftValue: 'Mye tyver',
            rightValue: 'Altfor mye tyver'
          }
        },
        {

          type: 'hypoxicAir',
          data: {
            fromValue: '1,4',
            toValue: '4,4',
            commentValue: 'Altfor fuktig'
          }
        },
        {

          type: 'relativeHumidity',
          data: {
            fromValue: '1,4',
            toValue: '4,4',
            commentValue: 'Altfor fuktig' }
        },
        {
          type: 'pest',
          data: {
            identificationValue: 'Mye skadedyr',
            commentValue: 'Ikke gjort noe med',
            observations: [
                { lifeCycle: 'Larva',
                count: '4' },
                { lifeCycle: 'Puppe',
                count: '32' }
            ]
          }
        },
        {
          type: 'vannskaderisiko',
          data: {
            leftValue: 'Vannskade',
            rightValue: 'Altfor vått'
          }
        },
        {
          type: 'temperature',
          data: {
            fromValue: '1,4',
            toValue: '4,4',
            commentValue: 'Altfor fuktig' }
        }
      ] }
    const thereAndBackAgain = mapToFrontEnd(mapToBackEnd(frontend))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'year'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'month'))
    assert.ok(thereAndBackAgain.doneDate.isSame(frontend.doneDate, 'day'))
    assert.deepEqual(drop(thereAndBackAgain, 'doneDate'), drop(frontend, 'doneDate'))
  })
})
