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
const wrapAlcoholState = ((s) => {
  switch (s) {
    case 'Uttørket': return 'Uttørket'
    case 'nesten uttørket': return 'Nesten uttørket'
    case 'litt uttørket': return 'Litt uttørket'
    case 'noe uttørket': return 'Noe uttrørket'
    case 'tilfredsstillende': return 'Tilfredsstillende'
    default: return s
  }
})

const wrap = (be) => {
  const ret = {}
  ret.doneBy = {}
  ret.doneBy.id = be.doneBy
  ret.doneDate = be.doneDate
  ret.registeredDate = be.registeredDate
  ret.registeredBy = be.registeredBy
  // ret.doneBy = be.links.filter((f) => { return f.rel === 'actor' })[0].href
  ret.observations = be['subEvents-parts'] ? be['subEvents-parts'].map((o) => {
    const retobs = {}
    retobs.type = ''
    retobs.data = {}
    switch (o.eventType.toLowerCase()) {
      case 'observationlightcontrol':
        retobs.type = 'lux'
        retobs.data.leftValue = o.lysforhold
        retobs.data.rightValue = o.note
        return retobs
      case 'observationgas':
        retobs.type = 'gas'
        retobs.data.leftValue = o.gass
        retobs.data.rightValue = o.note
        return retobs
      case 'observationmold':
        retobs.type = 'mold'
        retobs.data.leftValue = o.mugg
        retobs.data.rightValue = o.note
        return retobs
      case 'observationcleaning':
        retobs.type = 'cleaning'
        retobs.data.leftValue = o.renhold
        retobs.data.rightValue = o.note
        return retobs
      case 'observationskallsikring':
        retobs.type = 'skallsikring'
        retobs.data.leftValue = o.skallsikring
        retobs.data.rightValue = o.note
        return retobs
      case 'observationbrannsikring':
        retobs.type = 'brannsikring'
        retobs.data.leftValue = o.brannsikring
        retobs.data.rightValue = o.note
        return retobs
      case 'observationtyverisikring':
        retobs.type = 'tyverisikring'
        retobs.data.leftValue = o.tyverisikring
        retobs.data.rightValue = o.note
        return retobs
      case 'observationvannskaderisiko':
        retobs.type = 'vannskaderisiko'
        retobs.data.leftValue = o.vannskaderisiko
        retobs.data.rightValue = o.note
        return retobs
      case 'observationhypoxicair':
        retobs.type = 'hypoxicAir'
        retobs.data.fromValue = o.from.toString().replace('.', ',')
        retobs.data.toValue = o.to.toString().replace('.', ',')
        retobs.data.commentValue = o.note
        return retobs
      case 'observationtemperature':
        retobs.type = 'temperature'
        retobs.data.fromValue = o.from.toString().replace('.', ',')
        retobs.data.toValue = o.to.toString().replace('.', ',')
        retobs.data.commentValue = o.note
        return retobs
      case 'observationrelativehumidity':
        retobs.type = 'relativeHumidity'
        retobs.data.fromValue = o.from.toString().replace('.', ',')
        retobs.data.toValue = o.to.toString().replace('.', ',')
        retobs.data.commentValue = o.note
        return retobs
      case 'observationpest':
        retobs.type = 'pest'
        retobs.data.identificationValue = o.identifikasjon
        retobs.data.commentValue = o.note
        retobs.data.observations = o.lifeCycles ? o.lifeCycles.map((l) => {
          const obs = {}
          obs.lifeCycle = l.lifeCycle
          obs.count = l.count.toString().replace('.', ',')
          return obs
        }
      ) : []
        return retobs
      case 'observationalcohol':
        retobs.type = 'alcohol'
        retobs.data.statusValue = wrapAlcoholState(o.tilstand)
        retobs.data.volumeValue = o.volum.toString().replace('.', ',')
        retobs.data.commentValue = o.note
        return retobs
      default:
        retobs.data.error = `Not supported / ikke støttet : ${o.eventType.toLowerCase()}`
        return retobs
    }
  }) : []
  return ret
}
const toFrontEnd = (be) => {
  return wrap(be)
}

export default toFrontEnd
