// @flow

import type { AppSession } from 'types/appSession';

import Analysis from '../../../models/analysis';
import type {
  AnalysisResultTypes,
  ImportAnalysisResult,
  AnalysisResult,
  Size,
  GenericResult,
  AgeResult,
  RadioCarbonResult,
  MeasurementResult,
  ExtractionResult
} from 'types/analysisResult';
import type { StoreState } from './analysisExchangeStore';
import type {
  ResultExchangeTemplates,
  GenericResultExchangeTemplate,
  AgeResultExchangeTemplate,
  RadioCarbonResultExchangeTemplate,
  MeasurementResultExchangeTemplate,
  ExtractionResultExchangeTemplate
} from './exchangeTemplate';
import { simplePut } from '../../../shared/RxAjax';

export const uploadAnalysisResultAction = (
  appSession: AppSession,
  analysisExchangeStore: StoreState,
  onImportSuccess: () => void,
  onImportError: (err: Array<string>) => void
) => () => {
  const rows = analysisExchangeStore.importResult.rows;
  const analysis = analysisExchangeStore.analysis;
  const analysisResultType = analysisExchangeStore.analysisResultType;
  if (rows.length > 0 && analysis && analysisResultType) {
    try {
      const request = createRequest(analysisResultType || 'GenericResult', rows);

      Analysis.importResult(simplePut)({
        analysisId: analysis.id,
        museumId: appSession.museumId,
        token: appSession.accessToken,
        result: request
      })
        .toPromise()
        .then(response => {
          response.error
            ? onImportError([
                'Failed to load data to the server',
                response.error.xhr.response.message
              ])
            : onImportSuccess();
        });
    } catch (err) {
      onImportError([err]);
    }
  } else {
    onImportError(['No results to upload']);
  }
};

export const createRequest = (
  analysisResultType: AnalysisResultTypes,
  rows: Array<ResultExchangeTemplates>
): ImportAnalysisResult => {
  const collectionResult = rows.find(res => res.type === 'analysis');
  if (!collectionResult) {
    throw new Error('Missing analysis row');
  }
  const objectResults = rows.filter(res => res.type !== 'analysis');
  return {
    collectionResult: mapToAnalysisResult(analysisResultType, collectionResult),
    objectResults: objectResults.map(res =>
      mapToAnalysisEventResult(analysisResultType, res)
    )
  };
};

const mapToAnalysisEventResult = (
  type: AnalysisResultTypes,
  result: ResultExchangeTemplates
) => {
  if (!result.objectId) {
    throw new Error('Missing object id for analysis ' + result.analysisId);
  }
  return {
    objectId: result.sampleObjectId || result.objectId,
    eventId: parseInt(result.analysisId, 10),
    result: mapToAnalysisResult(type, result)
  };
};

export const mapToAnalysisResult = (
  type: AnalysisResultTypes,
  result: ResultExchangeTemplates
): AnalysisResult => {
  switch (type) {
    case 'GenericResult':
      // Flow find this ok, but not the other path.
      const gr = (result: GenericResultExchangeTemplate);
      return ({
        type: 'GenericResult',
        extRef: gr.resultExternalRef ? [gr.resultExternalRef] : null,
        comment: gr.resultComment ? gr.resultComment : null
      }: GenericResult);

    case 'AgeResult':
      // $FlowFixMe | We know this basted on the type
      const ar = (result: AgeResultExchangeTemplate);
      return ({
        type: 'AgeResult',
        extRef: ar.resultExternalRef ? [ar.resultExternalRef] : null,
        comment: ar.resultComment ? ar.resultComment : null,
        age: ar.resultAge ? ar.resultAge : null
      }: AgeResult);

    case 'RadioCarbonResult':
      // $FlowFixMe | We know this basted on the type
      const rcr = (result: RadioCarbonResultExchangeTemplate);
      return ({
        type: 'RadioCarbonResult',
        extRef: rcr.resultExternalRef ? [rcr.resultExternalRef] : null,
        comment: rcr.resultComment ? rcr.resultComment : null,
        ageEstimate: rcr.resultAgeEstimate ? rcr.resultAgeEstimate : null,
        standardDeviation: rcr.resultStandardDeviation
          ? rcr.resultStandardDeviation
          : null
      }: RadioCarbonResult);

    case 'MeasurementResult':
      // $FlowFixMe | We know this basted on the type
      const mr = (result: MeasurementResultExchangeTemplate);
      return ({
        type: 'MeasurementResult',
        extRef: mr.resultExternalRef ? [mr.resultExternalRef] : null,
        comment: mr.resultComment ? mr.resultComment : null,
        measurementId: mr.resultMeasurementId ? mr.resultMeasurementId : null,
        measurementType: mr.resultMeasurementType ? mr.resultMeasurementType : null,
        size: toSize(mr.resultSizeUnit, mr.resultSizeValue),
        precision: mr.resultPrecision,
        method: mr.resultMethod
      }: MeasurementResult);

    case 'ExtractionResult':
      // $FlowFixMe | We know this basted on the type
      const er = (result: ExtractionResultExchangeTemplate);
      return ({
        type: 'ExtractionResult',
        extRef: er.resultExternalRef ? [er.resultExternalRef] : null,
        comment: er.resultComment ? er.resultComment : null,
        storageMedium: er.resultStorageMedium ? er.resultStorageMedium : null,
        concentration: toSize(er.resultConcentrationUnit, er.resultConcentrationValue),
        volume: toSize(er.resultVolumeUnit, er.resultVolumeValue)
      }: ExtractionResult);

    default:
      throw new Error('Unsupported result type ' + type);
  }
};

const toSize = (unit: ?string, value: ?string): ?Size =>
  value && unit
    ? {
        unit: unit,
        value: parseInt(value, 10)
      }
    : null;
