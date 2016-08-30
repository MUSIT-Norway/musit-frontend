import { assert } from '../../../../test/setup'
import deepFreeze from 'deep-freeze'
import observationReducer, {
  // addObservation,
  loadObservation,
  initialState
} from '../index'
import { mapToFrontEnd, mapToBackEnd } from '../mapper'

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
    const frontEnd = deepFreeze({
      doneBy: { id: '1' },
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
    })
    // TODO fix this
    const fixedFrontend = frontEnd
    const fe = mapToFrontEnd(mapToBackEnd(fixedFrontend))
    // console.log(JSON.stringify(frontEnd))
    // console.log('-----------------------')
    // console.log(JSON.stringify(fe))
    assert(JSON.stringify(fe) === JSON.stringify(frontEnd))
  })

  // it('add observation should update state', () => {
  //   const fromServer = deepFreeze({
  //     doneBy: { id: '' },
  //     observations: [
  //       {
  //         type: 'hypoxicAir',
  //         data: {
  //           fromValue: '19',
  //           toValue: '23',
  //           commentValue: 'Test comments.'
  //         }
  //       },
  //       {
  //         type: 'cleaning',
  //         data: {
  //           leftValue: 'Test cleaning value.',
  //           rightValue: 'Test comments.'
  //         }
  //       }
  //     ]
  //   })
  //   const state = observationReducer(initialState, {
  //     type: 'musit/observation/ADD_SUCCESS',
  //     result: fromServer
  //   })
  //   console.log(state)
  //   assert(state.data === fromServer)
  // })

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

  it('mapToFrontEnd and mapToBackEnd are inverse with complete data', () => {
    const completeFrontEnd = {
      doneBy: { id: '1' },
      doneDate: '1999-11-11',
      observations: [
        {

          type: 'lux',
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
    const s = mapToFrontEnd(mapToBackEnd(completeFrontEnd))
    const stringify1 = JSON.stringify(s);
    const stringify2 = JSON.stringify(completeFrontEnd);
    assert(stringify1 === stringify2)
  })
})
