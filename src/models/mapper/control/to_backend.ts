import { find } from 'lodash';
import {
  parseAlcohol,
  parseCleaning,
  parseRangeObservation,
  parsePest,
  parseLightCondition,
  parseGas,
  parseMold
} from '../../../models/mapper/observation/to_backend';
import { Option } from './../../../shared/util';
import Actor from '../../../models/actor';
import { TODO } from '../../../types/common';

function getDoneDate(observations: TODO, state: TODO) {
  return observations && observations.doneDate ? observations.doneDate : state.doneDate;
}

function getDoneBy(observations: TODO, state: TODO) {
  return observations && observations.doneBy ? observations.doneBy : state.doneBy;
}

function getObservation(observations: TODO, field: TODO): Option {
  return new Option(
    observations &&
      observations.observations &&
      find(observations.observations, ['type', field])
  );
}

function parseObservation(observations: TODO, field: TODO, parseFn: TODO) {
  return getObservation(observations, field).map(obs => parseFn(obs.data));
}

function getControl(ok: TODO, observations: TODO, field: TODO, parseFn: TODO) {
  return {
    ok,
    observation: parseObservation(observations, field, parseFn)
  };
}

export const mapToBackend = (state: TODO, observations: TODO, nodeId: TODO) => {
  const r = {} as TODO;
  r.eventType = 'Control';
  r.doneBy = Actor.getActorId(getDoneBy(observations, state));
  r.doneDate = getDoneDate(observations, state);
  r.affectedThing = nodeId * 1;
  r.temperature = new Option(state.temperatureOK).map(ok =>
    getControl(ok, observations, 'temperature', parseRangeObservation)
  );
  r.hypoxicAir = new Option(state.hypoxicAirOK).map(ok =>
    getControl(ok, observations, 'hypoxicAir', parseRangeObservation)
  );
  r.gas = new Option(state.gasOK).map(ok =>
    getControl(ok, observations, 'gas', parseGas)
  );
  r.cleaning = new Option(state.cleaningOK).map(ok =>
    getControl(ok, observations, 'cleaning', parseCleaning)
  );
  r.relativeHumidity = new Option(state.relativeHumidityOK).map(ok =>
    getControl(ok, observations, 'relativeHumidity', parseRangeObservation)
  );
  r.lightingCondition = new Option(state.lightConditionOK).map(ok =>
    getControl(ok, observations, 'lightCondition', parseLightCondition)
  );
  r.alcohol = new Option(state.alcoholOK).map(ok =>
    getControl(ok, observations, 'alcohol', parseAlcohol)
  );
  r.pest = new Option(state.pestOK).map(ok =>
    getControl(ok, observations, 'pest', parsePest)
  );
  r.mold = new Option(state.moldOK).map(ok =>
    getControl(ok, observations, 'mold', parseMold)
  );
  return r;
};
