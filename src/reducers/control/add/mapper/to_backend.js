import { parseObservation } from '../../../observation/mapper/to_backend'

export const mapToBackend = (state, observations = []) => {
  const r = {}
  r.eventType = 'Control'
  r.doneBy = 1 // state.doneBy.id
  r.doneDate = state.doneDate
  r['subEvents-parts'] = Object.keys(state).filter((key) => key.endsWith('OK')).map((key) => {
    let eventType;
    switch (key) {
      case 'inertAirOK':
        eventType = 'ControlInertAir'
        break;
      case 'temperatureOK':
        eventType = 'ControlTemperature'
        break;
      case 'gasOK':
        eventType = 'ControlGas'
        break;
      case 'cleaningOK':
        eventType = 'ControlCleaning'
        break;
      case 'relativeHumidityOK':
        eventType = 'ControlRelativeHumidity'
        break;
      case 'lightConditionsOK':
        eventType = 'ControlLightConditions'
        break;
      case 'alcoholOK':
        eventType = 'ControlAlcohol'
        break;
      case 'pestOK':
        eventType = 'ControlPest'
        break;
      case 'moldOK':
        eventType = 'ControlMold'
        break;
      default:
        throw Error(`Unsupported control state key: ${key}`)
    }
    const control = { eventType, ok: state[key] }
    if (observations.length > 0) {
      const observationKey = key.substring(0, key.length - 2)
      const observation = observations.find((o) => o.type === observationKey)
      const mappedObservation = parseObservation(observation)
      control['subEvents-motivates'] = [mappedObservation]
    }
    return control
  })
  console.log(JSON.stringify(r))
  return r
}
