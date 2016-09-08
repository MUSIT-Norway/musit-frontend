import { assert } from '../../../../../test/setup'
import { parseISODateNonStrict as parseISODate } from '../../../../util'
import {
  mapToBackend
} from '../to_backend'

describe('ControlMapperReducer', () => {
  it('maps to correct backend structure', () => {
    const state = {
      doneBy: 'jarl',
      doneDate: parseISODate('2016-11-01'),
      temperatureOK: true,
      hypoxicAirOK: false,
      gasOK: true,
      cleaningOK: true,
      relativeHumidityOK: true,
      lightConditionsOK: true,
      alcoholOK: true,
      pestOK: false,
      moldOK: true
    }
    const transformed = mapToBackend(state)
    assert(transformed['subEvents-parts'][0].eventType === 'ControlTemperature')
    assert(transformed['subEvents-parts'][0].ok === true)
    assert(transformed['subEvents-parts'][1].eventType === 'ControlHypoxicAir')
    assert(transformed['subEvents-parts'][1].ok === false)
    assert(transformed['subEvents-parts'][2].eventType === 'ControlGas')
    assert(transformed['subEvents-parts'][2].ok === true)
    assert(transformed['subEvents-parts'][3].eventType === 'ControlCleaning')
    assert(transformed['subEvents-parts'][3].ok === true)
    assert(transformed['subEvents-parts'][4].eventType === 'ControlRelativeHumidity')
    assert(transformed['subEvents-parts'][4].ok === true)
    assert(transformed['subEvents-parts'][5].eventType === 'ControlLightingCondition')
    assert(transformed['subEvents-parts'][5].ok === true)
    assert(transformed['subEvents-parts'][6].eventType === 'ControlAlcohol')
    assert(transformed['subEvents-parts'][6].ok === true)
    assert(transformed['subEvents-parts'][7].eventType === 'ControlPest')
    assert(transformed['subEvents-parts'][7].ok === false)
    assert(transformed['subEvents-parts'][8].eventType === 'ControlMold')
    assert(transformed['subEvents-parts'][8].ok === true)
  })
})
