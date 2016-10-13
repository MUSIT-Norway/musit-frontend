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
import {DATE_FORMAT_ISO_FULL, parseFloatFromString, Option} from "./../../../util";

export function parseRangeObservation(el) {
  const re = {}
  re.range = {
    from: parseFloatFromString(el.fromValue),
    to: parseFloatFromString(el.toValue)
  }
  re.note = el.commentValue
  return re;
}

export function parseAlcohol(el) {
  const re = {}
  re.note = el.commentValue || el.comment
  re.condition = el.statusValue || el.status
  re.volume = parseFloatFromString(el.volumeValue || el.volume)
  return re;
}

export function parseWaterDamageAssessment(el) {
  const re = {}
  re.waterDamageAssessment = el.leftValue
  re.note = el.rightValue
  return re;
}

export function parseFireProtection(el) {
  const re = {}
  re.fireProtection = el.leftValue
  re.note = el.rightValue
  return re;
}

export function parseTheftProtection(el) {
  const re = {}
  re.theftProtection = el.leftValue
  re.note = el.rightValue
  return re;
}

export function parsePerimeterSecurity(el) {
  const re = {}
  re.perimeterSecurity = el.leftValue
  re.note = el.rightValue
  return re;
}

export function parseMold(el) {
  const re = {}
  re.mold = el.leftValue
  re.note = el.rightValue
  return re;
}

export function parseCleaning(el) {
  const re = {}
  re.cleaning = el.leftValue
  re.note = el.rightValue
  return re;
}

export function parseGas(el) {
  const re = {}
  re.gas = el.leftValue
  re.note = el.rightValue
  return re;
}

export function parseLightCondition(el) {
  const re = {}
  re.lightingCondition = el.leftValue
  re.note = el.rightValue
  return re;
}

export function parsePest(el) {
  const re = {}
  re.identification = el.identificationValue
  re.note = el.commentValue
  re.lifecycles = el.observations.map((o) => {
    const ret = {}
    ret.stage = o.lifeCycle
    ret.quantity = parseFloatFromString(o.count)
    return ret
  })
  return re;
}

function getData(observations, field) {
  return (observations.find(f => f.type === field) || {}).data;
}

export default (observation: any, nodeId: string | number) => {
  const r = {}
  r.eventType = 'Observation'
  r.doneBy = observation.doneBy.id
  r.doneDate = observation.doneDate.format(DATE_FORMAT_ISO_FULL)
  r.affectedThing = nodeId * 1
  const observations = observation.observations;
  r.temperature = new Option(getData(observations, 'temperature')).map(parseRangeObservation)
  r.hypoxicAir = new Option(getData(observations, 'hypoxicAir')).map(parseRangeObservation)
  r.alcohol = new Option(getData(observations, 'alcohol')).map(parseAlcohol)
  r.cleaning = new Option(getData(observations, 'cleaning')).map(parseCleaning)
  r.lightingCondition = new Option(getData(observations, 'lightCondition')).map(parseLightCondition)
  r.fireProtection = new Option(getData(observations, 'brannsikring')).map(parseFireProtection)
  r.waterDamageAssessment = new Option(getData(observations, 'vannskaderisiko')).map(parseWaterDamageAssessment)
  r.gas = new Option(getData(observations, 'gas')).map(parseGas)
  r.mold = new Option(getData(observations, 'mold')).map(parseMold)
  r.pest = new Option(getData(observations, 'pest')).map(parsePest)
  r.theftProtection = new Option(getData(observations, 'tyverisikring')).map(parseTheftProtection)
  r.perimeterSecurity = new Option(getData(observations, 'skallsikring')).map(parsePerimeterSecurity)
  r.relativeHumidity = new Option(getData(observations, 'relativeHumidity')).map(parseRangeObservation)
  return r
}
