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


export const parseObservation = (el) => {
  const re = {}
  switch (el.type) {
    case 'pest':
      re.eventType = 'observationPest'
      re.identifikasjon = el.data.identificationValue
      re.note = el.data.commentValue
      re.livssykluser = el.data.observations.map((o) => {
        const ret = {}
        ret.livssyklus = o.lifeCycle
        ret.antall = parseFloat(o.count.replace(',', '.'))
        return ret
      })
      break
    case 'lux':
      re.eventType = 'observationLightControl'
      re.lysforhold = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'gas':
      re.eventType = 'observationGas'
      re.gass = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'cleaning':
      re.eventType = 'observationCleaning'
      re.renhold = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'relativeHumidity':
      re.eventType = 'observationRelativeHumidity'
      re.from = el.data.fromValue ? parseFloat(el.data.fromValue.replace(',', '.')) : null
      re.to = el.data.toValue ? parseFloat(el.data.toValue.replace(',', '.')) : null
      re.note = el.data.commentValue
      break
    case 'mold':
      re.eventType = 'observationMold'
      re.mugg = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'skallsikring':
      re.eventType = 'observationSkallSikring'
      re.skallsikring = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'tyverisikring':
      re.eventType = 'observationTyveriSikring'
      re.tyverisikring = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'brannsikring':
      re.eventType = 'observationBrannsikring'
      re.brannsikring = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'vannskaderisiko':
      re.eventType = 'observationVannskadeRisiko'
      re.vannskaderisiko = el.data.leftValue
      re.note = el.data.rightValue
      break
    case 'inertAir':
      re.eventType = 'ObservationInertAir'
      re.from = parseFloat(el.data.fromValue.replace(',', '.'))
      re.to = parseFloat(el.data.toValue.replace(',', '.'))
      re.note = el.data.commentValue
      break
    case 'alcohol':
      re.eventType = 'observationAlcohol'
      re.note = el.data.comment
      re.tilstand = el.data.status
      re.volum = parseFloat(el.data.volume.replace(',', '.'))
      break
    case 'temperature':
      re.eventType = 'observationTemperature'
      re.from = parseFloat(el.data.fromValue.replace(',', '.'))
      re.to = parseFloat(el.data.toValue.replace(',', '.'))
      re.note = el.data.commentValue
      break
    default:
      throw Error(`Invalid el type: ${el.type}`)
  }
  return re
}

const wrap = (e) => {
  const r = {}
  r.eventType = 'Observation'
  r.doneBy = e.doneBy.id
  r.doneDate = e.doneDate
  const observationData = e.observations ? e.observations.filter((f) => { return f.data }) : []
  r['subEvents-parts'] = observationData.map(parseObservation)
  return r
}

const toBackEnd = (fe) => {
  return wrap(fe)
}

export default toBackEnd
