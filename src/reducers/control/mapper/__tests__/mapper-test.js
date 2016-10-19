import {
  mapToBackend
} from '../to_backend'

describe('ControlMapperReducer', () => {
  it('maps to correct backend structure with no observations', () => {
    const state = {
      doneBy: 'jarl',
      doneDate: new Date(2016,10,1).toISOString(),
      temperatureOK: true,
      hypoxicAirOK: false,
      gasOK: true,
      cleaningOK: true,
      relativeHumidityOK: true,
      lightConditionOK: false,
      alcoholOK: true,
      pestOK: false,
      moldOK: true
    }
    const nodeId = 54
    const observations = {
      observations: [
        {
          type: 'hypoxicAir',
          data: {

          }
        },
        {
          type: 'lightCondition',
          data: {
            leftValue: 'Some light'
          }
        },
        {
          type: 'pest',
          data: {
            observations: []
          }
        }
      ]
    }
    const transformed = mapToBackend(state, observations, nodeId)
    expect(transformed).toMatchSnapshot()
  })
})
