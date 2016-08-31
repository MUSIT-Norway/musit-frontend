export const mapToBackend = (state, observations) => {
  const r = {}
  r.eventType = 'Control'
  r.doneBy = state.doneBy.id
  r.doneDate = state.doneDate
  r['subEvents-parts'] = Object.keys(state).filter((key) => key.endsWith('OK')).map((key) => {
    switch (key) {
      case 'inertAirOK':
        return {
          eventType: 'ControlHypoxicAir',
          ok: state[key]
        }
      case 'temperatureOK':
        return {
          eventType: 'ControlTemperature',
          ok: state[key]
        }
      case 'gasOK':
        return {
          eventType: 'ControlGas',
          ok: state[key]
        }
      case 'cleaningOK':
        return {
          eventType: 'ControlCleaning',
          ok: state[key]
        }
      case 'relativeHumidityOK':
        return {
          eventType: 'ControlRelativeHumidity',
          ok: state[key]
        }
      case 'lightConditionsOK':
        return {
          eventType: 'ControlLightingCondition',
          ok: state[key]
        }
      case 'alcoholOK':
        return {
          eventType: 'ControlAlcohol',
          ok: state[key]
        }
      case 'pestOK':
        return {
          eventType: 'ControlPest',
          ok: state[key]
        }
      case 'moldOK':
        return {
          eventType: 'ControlMold',
          ok: state[key]
        }
      default:
        throw Error(`Unsupported control state key: ${key}`)
    }
  })
  return r
}
