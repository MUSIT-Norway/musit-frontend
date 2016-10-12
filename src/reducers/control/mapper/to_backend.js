
import { parseObservation } from '../../observation/mapper/to_backend'
import { DATE_FORMAT_ISO_FULL } from './../../../util'

export const mapToBackend = (state, observations, nodeId) => {
  const r = {}
  r.eventType = 'Control'
  r.doneBy = observations && observations.doneBy ? observations.doneBy : state.doneBy
  r.doneBy = { actorId: r.doneBy.id, roleId: 1 }
  r.doneDate = observations && observations.doneDate ? observations.doneDate.format(DATE_FORMAT_ISO_FULL) :
      state.doneDate.format(DATE_FORMAT_ISO_FULL)
  r.affectedThing = {
    roleId: 1,
    objectId: nodeId * 1
  }
  r.parts = Object.keys(state).filter((key) => key.endsWith('OK')).map((key) => {
    let control
    switch (key) {
      case 'hypoxicAirOK':
        control = {
          eventType: 'ControlHypoxicAir',
          ok: state[key],
          doneBy: r.doneBy,
          doneDate: r.doneDate
        }
        break;
      case 'temperatureOK':
        control = {
          eventType: 'ControlTemperature',
          ok: state[key],
          doneBy: r.doneBy,
          doneDate: r.doneDate
        }
        break;
      case 'gasOK':
        control = {
          eventType: 'ControlGas',
          ok: state[key],
          doneBy: r.doneBy,
          doneDate: r.doneDate
        }
        break;
      case 'cleaningOK':
        control = {
          eventType: 'ControlCleaning',
          ok: state[key],
          doneBy: r.doneBy,
          doneDate: r.doneDate
        }
        break;
      case 'relativeHumidityOK':
        control = {
          eventType: 'ControlRelativeHumidity',
          ok: state[key],
          doneBy: r.doneBy,
          doneDate: r.doneDate
        }
        break;
      case 'lightConditionOK':
        control = {
          eventType: 'ControlLightingCondition',
          ok: state[key],
          doneBy: r.doneBy,
          doneDate: r.doneDate
        }
        break;
      case 'alcoholOK':
        control = {
          eventType: 'ControlAlcohol',
          ok: state[key],
          doneBy: r.doneBy,
          doneDate: r.doneDate
        }
        break;
      case 'pestOK':
        control = {
          eventType: 'ControlPest',
          ok: state[key],
          doneBy: r.doneBy,
          doneDate: r.doneDate
        }
        break;
      case 'moldOK':
        control = {
          eventType: 'ControlMold',
          ok: state[key],
          doneBy: r.doneBy,
          doneDate: r.doneDate
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
        control.motivates = parseObservation(control)(observation)
      }
    }
    return control;
  })
  return r
}
