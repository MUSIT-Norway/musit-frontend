import assert from 'assert'
import { parseISODateNonStrict as parseISODate } from '../../../../src/utils'
import {
  mapToBackend
} from '../../../../src/reducer/control/mapper/to_backend'

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
      lightConditionOK: true,
      alcoholOK: true,
      pestOK: false,
      moldOK: true
    }
    const transformed = mapToBackend(state)
    assert(transformed.parts[0].eventType === 'ControlTemperature')
    assert(transformed.parts[0].ok === true)
    assert(transformed.parts[1].eventType === 'ControlHypoxicAir')
    assert(transformed.parts[1].ok === false)
    assert(transformed.parts[2].eventType === 'ControlGas')
    assert(transformed.parts[2].ok === true)
    assert(transformed.parts[3].eventType === 'ControlCleaning')
    assert(transformed.parts[3].ok === true)
    assert(transformed.parts[4].eventType === 'ControlRelativeHumidity')
    assert(transformed.parts[4].ok === true)
    assert(transformed.parts[5].eventType === 'ControlLightingCondition')
    assert(transformed.parts[5].ok === true)
    assert(transformed.parts[6].eventType === 'ControlAlcohol')
    assert(transformed.parts[6].ok === true)
    assert(transformed.parts[7].eventType === 'ControlPest')
    assert(transformed.parts[7].ok === false)
    assert(transformed.parts[8].eventType === 'ControlMold')
    assert(transformed.parts[8].ok === true)
  })
})
