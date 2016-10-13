
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
import { parseISODateNonStrict as parseISODate, formatFloatToString, Option } from './../../../util'

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

function parseLightingCondition(o) {
  const retobs = {}
  retobs.type = 'lightCondition'
  retobs.data = {}
  retobs.data.leftValue = o.lightingCondition
  retobs.data.rightValue = o.note
  return retobs
}
function parseGas(o) {
  const retobs = {}
  retobs.type = 'gas'
  retobs.data = {}
  retobs.data.leftValue = o.gas
  retobs.data.rightValue = o.note
  return retobs
}
function parseMold(o) {
  const retobs = {}
  retobs.type = 'mold'
  retobs.data = {}
  retobs.data.leftValue = o.mold
  retobs.data.rightValue = o.note
  return retobs
}
function parseCleaning(o) {
  const retobs = {}
  retobs.type = 'cleaning'
  retobs.data = {}
  retobs.data.leftValue = o.cleaning
  retobs.data.rightValue = o.note
  return retobs
}
function parsePerimeterSecurity(o) {
  const retobs = {}
  retobs.type = 'skallsikring'
  retobs.data = {}
  retobs.data.leftValue = o.perimeterSecurity
  retobs.data.rightValue = o.note
  return retobs
}
function parseFireProtection(o) {
  const retobs = {}
  retobs.type = 'brannsikring'
  retobs.data = {}
  retobs.data.leftValue = o.fireProtection
  retobs.data.rightValue = o.note
  return retobs
}
function parseTheftProtection(o) {
  const retobs = {}
  retobs.type = 'tyverisikring'
  retobs.data = {}
  retobs.data.leftValue = o.theftProtection
  retobs.data.rightValue = o.note
  return retobs
}
function parseWaterDamageAssessment(o) {
  const retobs = {}
  retobs.type = 'vannskaderisiko'
  retobs.data = {}
  retobs.data.leftValue = o.waterDamageAssessment
  retobs.data.rightValue = o.note
  return retobs
}
function parseHypoxicAir(o) {
  const retobs = {}
  retobs.type = 'hypoxicAir'
  retobs.data = {}
  retobs.data.fromValue = formatFloatToString(o.range.from)
  retobs.data.toValue = formatFloatToString(o.range.to)
  retobs.data.commentValue = o.note
  return retobs
}
function parseTemperature(o) {
  const retobs = {}
  retobs.type = 'temperature'
  retobs.data = {}
  retobs.data.fromValue = formatFloatToString(o.range.from)
  retobs.data.toValue = formatFloatToString(o.range.to)
  retobs.data.commentValue = o.note
  return retobs
}
function parseRelativeHumidity(o) {
  const retobs = {}
  retobs.type = 'relativeHumidity'
  retobs.data = {}
  retobs.data.fromValue = formatFloatToString(o.range.from)
  retobs.data.toValue = formatFloatToString(o.range.to)
  retobs.data.commentValue = o.note
  return retobs
}
function parsePest(o) {
  const retobs = {}
  retobs.type = 'pest'
  retobs.data = {}
  retobs.data.identificationValue = o.identification
  retobs.data.commentValue = o.note
  retobs.data.observations = [].concat(o.lifecycles).map((l) => {
    const obs = {}
    obs.lifeCycle = l.stage
    obs.count = formatFloatToString(l.quantity)
    return obs
  })
  return retobs
}
function parseAlcohol(o) {
  const retobs = {}
  retobs.type = 'alcohol'
  retobs.data = {}
  retobs.data.statusValue = wrapAlcoholState(o.condition)
  retobs.data.volumeValue = formatFloatToString(o.volume)
  retobs.data.commentValue = o.note
  return retobs
}

const wrap = (be) => {
  const ret = {}
  ret.doneBy = {}
  ret.doneBy.id = be.doneBy
  ret.doneDate = parseISODate(be.doneDate)
  ret.registeredDate = be.registeredDate
  ret.registeredBy = be.registeredBy
  ret.observations = [
    new Option(be.temperature).map(parseTemperature),
    new Option(be.hypoxicAir).map(parseHypoxicAir),
    new Option(be.alcohol).map(parseAlcohol),
    new Option(be.cleaning).map(parseCleaning),
    new Option(be.lightingCondition).map(parseLightingCondition),
    new Option(be.fireProtection).map(parseFireProtection),
    new Option(be.waterDamageAssessment).map(parseWaterDamageAssessment),
    new Option(be.gas).map(parseGas),
    new Option(be.mold).map(parseMold),
    new Option(be.pest).map(parsePest),
    new Option(be.theftProtection).map(parseTheftProtection),
    new Option(be.perimeterSecurity).map(parsePerimeterSecurity),
    new Option(be.relativeHumidity).map(parseRelativeHumidity)
  ].filter(o => o)
  return ret
}

const toFrontEnd = (be) => {
  return wrap(be)
}

export default toFrontEnd
