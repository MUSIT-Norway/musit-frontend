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
import { DATE_FORMAT_ISO, parseFloatFromString } from './../../../util'

export const parseObservation = (el) => {
  const re = {}
  switch (el.type) {
    case 'pest':
      re.eventType = 'ObservationPest'
      re.identification = el.data.identificationValue
      re.note = el.data.commentValue
      re.lifeCycles = el.data.observations.map((o) => {
        const ret = {}
        ret.stage = o.lifeCycle
        ret.number = parseFloatFromString(o.count)
        return ret
      })
      break
    case 'lightConditions':
      re.eventType = 'ObservationLightingCondition'
      re.lightingCondition = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'gas':
      re.eventType = 'ObservationGas'
      re.gas = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'cleaning':
      re.eventType = 'ObservationCleaning'
      re.cleaning = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'relativeHumidity':
      re.eventType = 'observationRelativeHumidity'
      re.from = parseFloatFromString(el.data.fromValue)
      re.to = parseFloatFromString(el.data.toValue)
      re.note = el.data.commentValue
      break
    case 'mold':
      re.eventType = 'ObservationMold'
      re.mold = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'skallsikring':
      re.eventType = 'ObservationPerimeterSecurity'
      re.perimeterSecurity = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'tyverisikring':
      re.eventType = 'ObservationTheftProtection'
      re.theftProtection = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'brannsikring':
      re.eventType = 'ObservationFireProtection'
      re.fireProtection = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'vannskaderisiko':
      re.eventType = 'ObservationWaterDamageAssessment'
      re.waterDamageAssessment = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'hypoxicAir':
      re.eventType = 'ObservationHypoxicAir'
      re.from = parseFloatFromString(el.data.fromValue)
      re.to = parseFloatFromString(el.data.toValue)
      re.note = el.data.commentValue
      break
    case 'alcohol': {
      re.eventType = 'ObservationAlcohol'
      re.note = el.data.commentValue || el.data.comment
      re.condition = el.data.statusValue || el.data.status
      const volumeValue = el.data.volumeValue || el.data.volume
      re.volume = parseFloatFromString(volumeValue)
      break
    }
    case 'temperature':
      re.eventType = 'observationTemperature'
      re.from = parseFloatFromString(el.data.fromValue)
      re.to = parseFloatFromString(el.data.toValue)
      re.note = el.data.commentValue
      break
    default:
      throw Error(`Invalid type ${el.type.toLowerCase()}`)
  }
  return re
}

const wrap = (e) => {
  const r = {}
  r.eventType = 'Observation'
  r.doneBy = e.doneBy.id
  r.doneDate = e.doneDate.format(DATE_FORMAT_ISO)
  r['subEvents-parts'] = e.observations ? e.observations.filter((f) => { return f.data }).map(parseObservation) : []
  return r
}

const toBackEnd = (fe) => {
  return wrap(fe)
}

export default toBackEnd
