import assert from 'assert'
import observationControlGridReducer from '../../../../src/reducer/grid/observationcontrol/index'

const initialState = {
  data: [
    { eventType: 'Observation',
    doneDate: '1990-11-11',
    doneBy: '2',
    'subEvents-parts': [
      { eventType: 'ObservationLightingCondition',
      lightingCondition: 'Veldig lyst idag',
      note: 'Skru ned lyset' },
      { eventType: 'ObservationAlcohol',
      condition: 'Mye alkohol',
      note: 'Tynn ut',
      volume: '93.5' },
      { eventType: 'ObservationPest',
      identification: 'Banafluer i fruktkurven',
      note: 'Eplecidereddik og Zalo',
      lifeCycles: [{ stage: 'Puppeskinn', number: '3' }, { stage: 'Larva', number: '3' }] }
    ] },
    { eventType: 'Control',
    doneDate: '1981-12-01',
    doneBy: '1',
    'subEvents-parts': [
      { eventType: 'ControlRelativeHumidity',
       OK: true },
      { eventType: 'ControlLightingCondition',
       OK: true },
      { eventType: 'ControlTemperature',
       OK: false },
      { eventType: 'ControlHypoxicAir',
       OK: false },
      { eventType: 'ControlAlcohol',
       OK: true }
    ]
   },
    { eventType: 'Observation',
    doneDate: '1994-02-21',
    doneBy: '2',
    'subEvents-parts': [
      { eventType: 'ObservationMold',
      mold: 'Muggent',
      note: 'Eddik' },
      { eventType: 'ObservationCleaning',
      cleaning: 'Urent',
      note: 'Her må der vaskes bedre' },
      { eventType: 'ObservationPest',
      identification: 'Sommerfugler i under takbjelken',
      note: 'Gasses',
      lifeCycles: [{ stage: 'Puppe', number: '1' }, { stage: 'Larva', number: '3' }] }
    ] },
    { eventType: 'Control',
    doneDate: '1891-12-01',
    doneBy: '2',
    'subEvents-parts': [
      { eventType: 'ControlCleaning',
       OK: true },
      { eventType: 'ControlHypoxicAir',
       OK: true },
      { eventType: 'ControlGass',
       OK: false },
      { eventType: 'ControlHypoxicAir',
       OK: false },
      { eventType: 'ControlPest',
       OK: true }
    ] }
  ]
}

describe('ObservationControlGridReducer', () => {
  it('Initial state is set', () => {
    const state = observationControlGridReducer(initialState, {})
    assert(state === initialState)
  }) })
