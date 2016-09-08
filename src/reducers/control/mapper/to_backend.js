import { parseObservation } from '../../observation/mapper/to_backend'
import { DATE_FORMAT_ISO } from './../../../util'

export const mapToBackend = (state, observations) => {
  const r = {}
  r.eventType = 'Control'
  r.doneBy = observations && observations.doneBy ? observations.doneBy.id :
      state.doneBy.id
  r.doneDate = observations && observations.doneDate ? observations.doneDate.format(DATE_FORMAT_ISO) :
      state.doneDate.format(DATE_FORMAT_ISO)
  r['subEvents-parts'] = Object.keys(state).filter((key) => key.endsWith('OK')).map((key) => {
    let control
    switch (key) {
      case 'hypoxicAirOK':
        control = {
          eventType: 'ControlHypoxicAir',
          ok: state[key]
        }
        break;
      case 'temperatureOK':
        control = {
          eventType: 'ControlTemperature',
          ok: state[key]
        }
        break;
      case 'gasOK':
        control = {
          eventType: 'ControlGas',
          ok: state[key]
        }
        break;
      case 'cleaningOK':
        control = {
          eventType: 'ControlCleaning',
          ok: state[key]
        }
        break;
      case 'relativeHumidityOK':
        control = {
          eventType: 'ControlRelativeHumidity',
          ok: state[key]
        }
        break;
      case 'lightConditionsOK':
        control = {
          eventType: 'ControlLightingCondition',
          ok: state[key]
        }
        break;
      case 'alcoholOK':
        control = {
          eventType: 'ControlAlcohol',
          ok: state[key]
        }
        break;
      case 'pestOK':
        control = {
          eventType: 'ControlPest',
          ok: state[key]
        }
        break;
      case 'moldOK':
        control = {
          eventType: 'ControlMold',
          ok: state[key]
        }
        break;
      default:
        throw Error(`Unsupported control state key: ${key}`)
    }
    if (observations && observations.observations) {
      const observationKey = key.substring(0, key.length - 2)
      const index = observations.observations.findIndex(o => o.type === observationKey)
      if (index >= 0) {
        const observation = observations.observations[index]
        control['subEvents-motivates'] = [parseObservation(observation)]
      }
    }
    return control;
  })
  return r
}
