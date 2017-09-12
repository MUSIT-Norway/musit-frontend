// @flow

import concat from 'lodash/concat';

import type { AnalysisResultTypes } from 'types/analysisResult';
import type { AnalysisCollection } from 'types/analysis';
import type { SampleType } from 'types/sample';

export type ExchangeElementType = 'sample' | 'collection' | 'analysis';

export type BaseExchangeTemplate = {
  type: ExchangeElementType,
  analysisId: number,
  objectId: ?string,
  museumNo: ?string,
  subNo: ?string,
  arkFindingNo: ?string,
  term: ?string,
  // sample fields
  sampleObjectId: ?string,
  sampleNum: ?number,
  sampleId: ?string,
  sampleType: ?SampleType
};

/**
 * GenericResult
 */
export type GenericResultExchangeTemplate = BaseExchangeTemplate & {
  resultExternalRef: ?string,
  resultComment: ?string
};
export const genericResultHeader = ['resultExternalRef', 'resultComment'];

/**
 * AgeResult
 */
export type AgeResultExchangeTemplate = BaseExchangeTemplate & {
  resultExternalRef: ?string,
  resultComment: ?string,
  resultAge: ?string
};
export const ageResultHeader = ['resultExternalRef', 'resultComment', 'resultAge'];

/**
 * RadioCarbonResult
 */
export type RadioCarbonResultExchangeTemplate = BaseExchangeTemplate & {
  resultExternalRef: ?string,
  resultComment: ?string,
  resultAgeEstimate: ?string,
  resultStandardDeviation: ?string
};
export const radioCarbonResultHeader = [
  'resultExternalRef',
  'resultComment',
  'resultAgeEstimate',
  'resultStandardDeviation'
];

/**
 * MeasurementResult
 */
export type MeasurementResultExchangeTemplate = BaseExchangeTemplate & {
  resultExternalRef: ?string,
  resultComment: ?string,
  resultMeasurementId: ?string,
  resultMeasurementType: ?string,
  resultSizeUnit: ?string,
  resultSizeValue: ?string,
  resultPrecision: ?string,
  resultMethod: ?string
};

export const measurementResultHeader = [
  'resultExternalRef',
  'resultComment',
  'resultMeasurementId',
  'resultMeasurementType',
  'resultSizeUnit',
  'resultSizeValue',
  'resultPrecision',
  'resultMethod'
];

/**
 * ExtractionResult
 */
export type ExtractionResultExchangeTemplate = BaseExchangeTemplate & {
  resultExternalRef: ?string,
  resultComment: ?string,
  resultStorageMedium: ?string,
  resultConcentrationUnit: ?string,
  resultConcentrationValue: ?string,
  resultVolumeUnit: ?string,
  resultVolumeValue: ?string
};
export const extractionResultHeader = [
  'resultExternalRef',
  'resultComment',
  'resultStorageMedium',
  'resultConcentrationUnit',
  'resultConcentrationValue',
  'resultVolumeUnit',
  'resultVolumeValue'
];

export type ResultExchangeTemplates =
  | GenericResultExchangeTemplate
  | AgeResultExchangeTemplate
  | RadioCarbonResultExchangeTemplate
  | MeasurementResultExchangeTemplate
  | ExtractionResultExchangeTemplate;

export const baseHeader = [
  'type',
  'analysisId',
  'objectId',
  'museumNo',
  'subNo',
  'arkFindingNo',
  'term',
  'sampleObjectId',
  'sampleNum',
  'sampleId',
  'sampleType'
];

export const getHeadersForType = (type: AnalysisResultTypes): Array<string> =>
  concat(baseHeader, getResultHeadersForType(type));

export const getResultHeadersForType = (type: AnalysisResultTypes): Array<string> => {
  switch (type) {
    case 'GenericResult':
      return genericResultHeader;
    case 'AgeResult':
      return ageResultHeader;
    case 'RadioCarbonResult':
      return radioCarbonResultHeader;
    case 'MeasurementResult':
      return measurementResultHeader;
    case 'ExtractionResult':
      return extractionResultHeader;
    default:
      throw new Error('Unsupported result type ' + type);
  }
};

export const createExchangeTemplate = (
  analysisCollection: ?AnalysisCollection,
  type: ?AnalysisResultTypes
): Array<ResultExchangeTemplates> => {
  if (
    analysisCollection &&
    analysisCollection.events &&
    analysisCollection.events.length > 0 &&
    type
  ) {
    const rows = createEventRow(analysisCollection, type);
    const analysis = createAnalysisCollectionRow(analysisCollection, type);

    rows.unshift(analysis);
    return rows;
  } else {
    return [];
  }
};

export const createAnalysisCollectionRow = (
  analysisCollection: AnalysisCollection,
  type: AnalysisResultTypes
): ResultExchangeTemplates => {
  const analysisCollectionRow: BaseExchangeTemplate = {
    type: 'analysis',
    analysisId: analysisCollection.id,
    // object fields
    objectId: null,
    museumNo: null,
    subNo: null,
    arkFindingNo: null,
    term: null,
    // sample fields
    sampleObjectId: null,
    sampleNum: null,
    sampleId: null,
    sampleType: null
  };

  return appendResultValuesToBase(analysisCollectionRow, type);
};

export const createEventRow = (
  analysisCollection: AnalysisCollection,
  type: AnalysisResultTypes
): Array<ResultExchangeTemplates> => {
  if (analysisCollection.events && type) {
    return analysisCollection.events.map(event => {
      const row = {
        type: event.affectedType,
        analysisId: event.id,
        // object fields
        objectId: event.sampleData
          ? event.sampleData.originatedObjectUuid || event.affectedThing
          : event.affectedThing,
        museumNo: event.objectData ? event.objectData.museumNo || null : null,
        subNo: event.objectData ? event.objectData.subNo || null : null,
        arkFindingNo: event.objectData ? event.objectData.arkFindingNo || null : null,
        term: event.objectData ? event.objectData.term || null : null,
        // sample fields
        sampleObjectId:
          event.sampleData && event.sampleData.originatedObjectUuid
            ? event.affectedThing
            : null,
        sampleNum: event.sampleData ? event.sampleData.sampleNum || null : null,
        sampleId: event.sampleData ? event.sampleData.sampleId || null : null,
        sampleType: event.sampleData ? event.sampleData.sampleType : null
      };

      return appendResultValuesToBase(row, type);
    });
  } else {
    return [];
  }
};

export const appendResultValuesToBase = (
  base: BaseExchangeTemplate,
  type: AnalysisResultTypes
): ResultExchangeTemplates => {
  switch (type) {
    case 'GenericResult':
      return ({
        ...base,
        resultExternalRef: null,
        resultComment: null
      }: GenericResultExchangeTemplate);
    case 'AgeResult':
      return ({
        ...base,
        resultExternalRef: null,
        resultComment: null,
        resultAge: null
      }: AgeResultExchangeTemplate);
    case 'RadioCarbonResult':
      return ({
        ...base,
        resultExternalRef: null,
        resultComment: null,
        resultAgeEstimate: null,
        resultStandardDeviation: null
      }: RadioCarbonResultExchangeTemplate);
    case 'MeasurementResult':
      return ({
        ...base,
        resultExternalRef: null,
        resultComment: null,
        resultMeasurementId: null,
        resultMeasurementType: null,
        resultSizeUnit: null,
        resultSizeValue: null,
        resultPrecision: null,
        resultMethod: null
      }: MeasurementResultExchangeTemplate);
    case 'ExtractionResult':
      return ({
        ...base,
        resultExternalRef: null,
        resultComment: null,
        resultStorageMedium: null,
        resultConcentrationUnit: null,
        resultConcentrationValue: null,
        resultVolumeUnit: null,
        resultVolumeValue: null
      }: ExtractionResultExchangeTemplate);
    default:
      throw new Error('Unsupported result type ' + type);
  }
};
