import { Maybe } from './common';

// @flow

export type AnalysisResultTypes =
  | 'GenericResult'
  | 'AgeResult'
  | 'RadioCarbonResult'
  | 'MeasurementResult'
  | 'ExtractionResult';

export type GenericResult = {
  type: AnalysisResultTypes;
  registeredBy?: Maybe<string>;
  registeredDate?: Maybe<string>;
  extRef: Maybe<Array<string>>;
  comment: Maybe<string>;
};
export type AgeResult = GenericResult & {
  age: Maybe<string>;
};
export type RadioCarbonResult = GenericResult & {
  ageEstimate: Maybe<string>;
  standardDeviation: Maybe<string>;
};

export type Size = {
  unit: string;
  value: number;
};
export type MeasurementResult = GenericResult & {
  measurementId: Maybe<string>;
  measurementType: Maybe<string>;
  size: Maybe<Size>;
  precision: Maybe<string>;
  method: Maybe<string>;
};

export type ExtractionResult = GenericResult & {
  storageMedium: Maybe<string>;
  concentration: Maybe<Size>;
  volume: Maybe<Size>;
};

export type AnalysisResult =
  | GenericResult
  | AgeResult
  | RadioCarbonResult
  | MeasurementResult
  | ExtractionResult;

export type ResultForObjectEvent = {
  objectId: string;
  eventId: number;
  result: AnalysisResult;
};

export type ImportAnalysisResult = {
  collectionResult: AnalysisResult;
  objectResults: Array<ResultForObjectEvent>;
};
