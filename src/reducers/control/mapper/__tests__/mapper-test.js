import assert from 'assert'
import { parseISODateNonStrict as parseISODate } from '../../../../util'
import {
  mapToBackend
} from '../to_backend'

describe('ControlMapperReducer', () => {
  it('maps to correct backend structure with no observations', () => {
    const state = {
      doneBy: 'jarl',
      doneDate: parseISODate('2016-11-01'),
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
    assert.ok(transformed.temperature)
    assert.ok(transformed.temperature.ok === true)
    assert.ok(!transformed.temperature.observation)
    assert.ok(transformed.hypoxicAir)
    assert.ok(transformed.hypoxicAir.ok === false)
    assert.ok(transformed.hypoxicAir.observation)
    assert.ok(transformed.gas)
    assert.ok(transformed.gas.ok === true)
    assert.ok(!transformed.gas.observation)
    assert.ok(transformed.cleaning)
    assert.ok(transformed.cleaning.ok === true)
    assert.ok(!transformed.cleaning.observation)
    assert.ok(transformed.relativeHumidity)
    assert.ok(transformed.relativeHumidity.ok === true)
    assert.ok(!transformed.relativeHumidity.observation)
    assert.ok(transformed.lightingCondition)
    assert.ok(transformed.lightingCondition.ok === false)
    assert.ok(transformed.lightingCondition.observation)
    assert.ok(transformed.alcohol)
    assert.ok(transformed.alcohol.ok === true)
    assert.ok(!transformed.alcohol.observation)
    assert.ok(transformed.pest)
    assert.ok(transformed.pest.ok === false)
    assert.ok(transformed.pest.observation)
    assert.ok(transformed.mold)
    assert.ok(transformed.mold.ok === true)
    assert.ok(!transformed.mold.observation)
  })
})
