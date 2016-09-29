/*
 *  MUSIT is a museum database to archive natural and cultural history data.
 *  Copyright (C) 2016  MUSIT Norway, part of www.uio.no (University of Oslo)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License,
 *  or any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import { DATE_FORMAT_ISO_FULL, parseFloatFromString } from './../../../util'

export const parseObservation = (r) => (el) => {
  const re = {}
  switch (el.type) {
    case 'pest':
      re.eventType = 'ObservationPest'
      re.identification = el.data.identificationValue
      re.note = el.data.commentValue
      re.lifecycles = el.data.observations.map((o) => {
        const ret = {}
        ret.stage = o.lifeCycle
        ret.quantity = parseFloatFromString(o.count)
        return ret
      })
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    case 'lightCondition':
      re.eventType = 'ObservationLightingCondition'
      re.lightingCondition = el.data.leftValue
      re.note = el.data.rightValue
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    case 'gas':
      re.eventType = 'ObservationGas'
      re.gas = el.data.leftValue
      re.note = el.data.rightValue
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    case 'cleaning':
      re.eventType = 'ObservationCleaning'
      re.cleaning = el.data.leftValue
      re.note = el.data.rightValue
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    case 'relativeHumidity':
      re.eventType = 'observationRelativeHumidity'
      re.from = parseFloatFromString(el.data.fromValue)
      re.to = parseFloatFromString(el.data.toValue)
      re.note = el.data.commentValue
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    case 'mold':
      re.eventType = 'ObservationMold'
      re.mold = el.data.leftValue
      re.note = el.data.rightValue
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    case 'skallsikring':
      re.eventType = 'ObservationPerimeterSecurity'
      re.perimeterSecurity = el.data.leftValue
      re.note = el.data.rightValue
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    case 'tyverisikring':
      re.eventType = 'ObservationTheftProtection'
      re.theftProtection = el.data.leftValue
      re.note = el.data.rightValue
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    case 'brannsikring':
      re.eventType = 'ObservationFireProtection'
      re.fireProtection = el.data.leftValue
      re.note = el.data.rightValue
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    case 'vannskaderisiko':
      re.eventType = 'ObservationWaterDamageAssessment'
      re.waterDamageAssessment = el.data.leftValue
      re.note = el.data.rightValue
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    case 'hypoxicAir':
      re.eventType = 'ObservationHypoxicAir'
      re.from = parseFloatFromString(el.data.fromValue)
      re.to = parseFloatFromString(el.data.toValue)
      re.note = el.data.commentValue
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    case 'alcohol': {
      re.eventType = 'ObservationAlcohol'
      re.note = el.data.commentValue || el.data.comment
      re.condition = el.data.statusValue || el.data.status
      const volumeValue = el.data.volumeValue || el.data.volume
      re.volume = parseFloatFromString(volumeValue)
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    }
    case 'temperature':
      re.eventType = 'observationTemperature'
      re.from = parseFloatFromString(el.data.fromValue)
      re.to = parseFloatFromString(el.data.toValue)
      re.note = el.data.commentValue
      re.doneBy = r.doneBy
      re.doneDate = r.doneDate
      break
    default:
      throw Error(`Invalid type ${el.type.toLowerCase()}`)
  }
  return re
}

export default (observation, nodeId) => {
  const r = {}
  r.eventType = 'Observation'
  r.doneBy = { actorId: observation.doneBy.id, roleId: 1 }
  r.doneDate = observation.doneDate.format(DATE_FORMAT_ISO_FULL)
  r.affectedThing = {
    roleId: 1,
    objectId: nodeId * 1
  }
  r.parts = observation.observations ? observation.observations.filter((f) => { return f.data }).map(parseObservation(r)) : []
  return r
}
