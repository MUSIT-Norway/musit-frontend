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
import { parseFloatFromString, Option } from '../../../shared/util';
import Actor from '../../actor';
import { TODO, MUSTFIX, Star } from '../../../types/common';

export function parseRangeObservation(el: TODO) {
  const re = {} as TODO;
  re.range = {
    from: parseFloatFromString(el.fromValue),
    to: parseFloatFromString(el.toValue)
  };
  re.note = el.commentValue;
  return re;
}

export function parseAlcohol(el: TODO) {
  const re = {} as TODO;
  re.note = el.commentValue || el.comment;
  re.condition = el.statusValue || el.status;
  re.volume = parseFloatFromString(el.volumeValue || el.volume);
  return re;
}

export function parseWaterDamageAssessment(el: TODO) {
  const re = {} as TODO;
  re.waterDamageAssessment = el.leftValue;
  re.note = el.rightValue;
  return re;
}

export function parseFireProtection(el: TODO) {
  const re = {} as TODO;
  re.fireProtection = el.leftValue;
  re.note = el.rightValue;
  return re;
}

export function parseTheftProtection(el: TODO) {
  const re = {} as TODO;
  re.theftProtection = el.leftValue;
  re.note = el.rightValue;
  return re;
}

export function parsePerimeterSecurity(el: TODO) {
  const re = {} as TODO;
  re.perimeterSecurity = el.leftValue;
  re.note = el.rightValue;
  return re;
}

export function parseMold(el: TODO) {
  const re = {} as TODO;
  re.mold = el.leftValue;
  re.note = el.rightValue;
  return re;
}

export function parseCleaning(el: TODO) {
  const re = {} as TODO;
  re.cleaning = el.leftValue;
  re.note = el.rightValue;
  return re;
}

export function parseGas(el: TODO) {
  const re = {} as TODO;
  re.gas = el.leftValue;
  re.note = el.rightValue;
  return re;
}

export function parseLightCondition(el: TODO) {
  const re = {} as TODO;
  re.lightingCondition = el.leftValue;
  re.note = el.rightValue;
  return re;
}

export function parsePest(el: TODO) {
  const re = {} as TODO;
  re.identification = el.identificationValue;
  re.note = el.commentValue;
  re.lifecycles = el.observations.map((o: TODO) => {
    const ret = {} as TODO;
    ret.stage = o.lifeCycle;
    ret.quantity = parseFloatFromString(o.count);
    return ret;
  });
  return re;
}

function getData(observations: TODO, field: TODO) {
  return (observations.find((f: TODO) => f.type === field) || ({} as TODO)).data;
}

export default (state: Star, nodeId: string | number) => {
  const r = {} as TODO;
  r.eventType = 'Observation';
  r.doneBy = Actor.getActorId(state.doneBy);
  r.doneDate = state.doneDate;
  r.affectedThing = (nodeId as MUSTFIX) * 1;
  r.temperature = new Option(getData(state.observations, 'temperature')).map(
    parseRangeObservation
  );
  r.hypoxicAir = new Option(getData(state.observations, 'hypoxicAir')).map(
    parseRangeObservation
  );
  r.alcohol = new Option(getData(state.observations, 'alcohol')).map(parseAlcohol);
  r.cleaning = new Option(getData(state.observations, 'cleaning')).map(parseCleaning);
  r.lightingCondition = new Option(getData(state.observations, 'lightCondition')).map(
    parseLightCondition
  );
  r.fireProtection = new Option(getData(state.observations, 'brannsikring')).map(
    parseFireProtection
  );
  r.waterDamageAssessment = new Option(
    getData(state.observations, 'vannskaderisiko')
  ).map(parseWaterDamageAssessment);
  r.gas = new Option(getData(state.observations, 'gas')).map(parseGas);
  r.mold = new Option(getData(state.observations, 'mold')).map(parseMold);
  r.pest = new Option(getData(state.observations, 'pest')).map(parsePest);
  r.theftProtection = new Option(getData(state.observations, 'tyverisikring')).map(
    parseTheftProtection
  );
  r.perimeterSecurity = new Option(getData(state.observations, 'skallsikring')).map(
    parsePerimeterSecurity
  );
  r.relativeHumidity = new Option(getData(state.observations, 'relativeHumidity')).map(
    parseRangeObservation
  );
  return r;
};
