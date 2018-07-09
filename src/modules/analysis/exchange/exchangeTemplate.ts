// @flow

import { concat } from 'lodash';

import { AnalysisResultTypes } from '../../../types/analysisResult';
import { AnalysisCollection } from '../../../types/analysis';
import { SampleType } from '../../../types/sample';
import { Maybe } from '../../../types/common';

export type ExchangeElementType = 'sample' | 'collection' | 'analysis';

export type BaseExchangeTemplate = {
  type: ExchangeElementType;
  analysisId: number;
  objectId: Maybe<string>;
  museumNo: Maybe<string>;
  subNo: Maybe<string>;
  arkFindingNo: Maybe<string>;
  term: Maybe<string>;
  // sample fields
  sampleObjectId: Maybe<string>;
  sampleNum: Maybe<number>;
  sampleId: Maybe<string>;
  sampleType: Maybe<SampleType>;
};

/**
 * GenericResult
 */
export type GenericResultExchangeTemplate = BaseExchangeTemplate & {
  resultExternalRef: Maybe<string>;
  resultComment: Maybe<string>;
};
export const genericResultHeader = ['resultExternalRef', 'resultComment'];

/**
 * AgeResult
 */
export type AgeResultExchangeTemplate = BaseExchangeTemplate & {
  resultExternalRef: Maybe<string>;
  resultComment: Maybe<string>;
  resultAge: Maybe<string>;
};
export const ageResultHeader = ['resultExternalRef', 'resultComment', 'resultAge'];

/**
 * RadioCarbonResult
 */
export type RadioCarbonResultExchangeTemplate = BaseExchangeTemplate & {
  resultExternalRef: Maybe<string>;
  resultComment: Maybe<string>;
  resultAgeEstimate: Maybe<string>;
  resultStandardDeviation: Maybe<string>;
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
  resultExternalRef: Maybe<string>;
  resultComment: Maybe<string>;
  resultMeasurementId: Maybe<string>;
  resultMeasurementType: Maybe<string>;
  resultSizeUnit: Maybe<string>;
  resultSizeValue: Maybe<string>;
  resultPrecision: Maybe<string>;
  resultMethod: Maybe<string>;
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
  resultExternalRef: Maybe<string>;
  resultComment: Maybe<string>;
  resultStorageMedium: Maybe<string>;
  resultConcentrationUnit: Maybe<string>;
  resultConcentrationValue: Maybe<string>;
  resultVolumeUnit: Maybe<string>;
  resultVolumeValue: Maybe<string>;
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
  analysisCollection: Maybe<AnalysisCollection>,
  type: Maybe<AnalysisResultTypes>
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
      return {
        ...base,
        resultExternalRef: null,
        resultComment: null
      } as GenericResultExchangeTemplate;
    case 'AgeResult':
      return {
        ...base,
        resultExternalRef: null,
        resultComment: null,
        resultAge: null
      } as AgeResultExchangeTemplate;
    case 'RadioCarbonResult':
      return {
        ...base,
        resultExternalRef: null,
        resultComment: null,
        resultAgeEstimate: null,
        resultStandardDeviation: null
      } as RadioCarbonResultExchangeTemplate;
    case 'MeasurementResult':
      return {
        ...base,
        resultExternalRef: null,
        resultComment: null,
        resultMeasurementId: null,
        resultMeasurementType: null,
        resultSizeUnit: null,
        resultSizeValue: null,
        resultPrecision: null,
        resultMethod: null
      } as MeasurementResultExchangeTemplate;
    case 'ExtractionResult':
      return {
        ...base,
        resultExternalRef: null,
        resultComment: null,
        resultStorageMedium: null,
        resultConcentrationUnit: null,
        resultConcentrationValue: null,
        resultVolumeUnit: null,
        resultVolumeValue: null
      } as ExtractionResultExchangeTemplate;
    default:
      throw new Error('Unsupported result type ' + type);
  }
};
