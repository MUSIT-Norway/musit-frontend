// @flow
import type { ConservationTypes } from './conservation';
import type { SampleType } from './sample';

export type SampleTypes = {
  [string]: Array<SampleType>,
  raw: Array<SampleType>
};

export type PredefinedConservation = {
  sampleTypes: ?SampleTypes,
  conservationTypes?: ?ConservationTypes
};
