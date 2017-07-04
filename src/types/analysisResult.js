// @flow

export type AnalysisResultTypes =
  | 'GenericResult'
  | 'AgeResult'
  | 'RadioCarbonResult'
  | 'MeasurementResult'
  | 'ExtractionResult';

export type GenericResult = {
  type: AnalysisResultTypes,
  registeredBy?: ?string,
  registeredDate?: ?string,
  extRef: ?Array<string>,
  comment: ?string
};
export type AgeResult = GenericResult & {
  age: ?string
};
export type RadioCarbonResult = GenericResult & {
  ageEstimate: ?string,
  standardDeviation: ?string
};

export type Size = {
  unit: string,
  value: number
};
export type MeasurementResult = GenericResult & {
  measurementId: ?string,
  measurementType: ?string,
  size: ?Size,
  precision: ?string,
  method: ?string
};

export type ExtractionResult = GenericResult & {
  storageMedium: ?string,
  concentration: ?Size,
  volume: ?Size
};

export type AnalysisResult =
  | GenericResult
  | AgeResult
  | RadioCarbonResult
  | MeasurementResult
  | ExtractionResult;

export type ResultForObjectEvent = {
  objectId: string,
  eventId: number,
  result: AnalysisResult
};

export type ImportAnalysisResult = {
  collectionResult: AnalysisResult,
  objectResults: Array<ResultForObjectEvent>
};
