// @flow
import { Language } from '../../../types/appSession';
import { Maybe } from '../../../types/common';

export const ExtractionResultStorageMediumValues = [
  'Buffer',
  'Buffer (Tris-HCL; no EDTA)',
  'Buffer (EDTA)',
  'Buffer (Omega kit)',
  'Buffer (Qiagen kit)',
  'Buffer (TBE)',
  'Buffer (TE)',
  'ddH2O',
  'Dry',
  'Ethanol 96%'
];

export const ExtractionResultVolumeValues = ['µL', 'mL'];

export const ExtractionResultConcentrationValues = ['ng/µl', 'µg/µl', 'mg/µl', 'g/µl'];

export const MeasurementResultMeasurementTypeValuesNo = [
  'Total lengde',
  'Gaffellengde',
  'Våtvekt (total)',
  'Tørrvekt (total)',
  'Antall individ/organismer',
  'Antall gjellestaver'
];

export const MeasurementResultMeasurementTypeValuesEn = [
  'Total length',
  'Fork length',
  'Total wet weight',
  'Total dry weight',
  'Organism quantity',
  'Number of gill-rakers'
];

const MeasurementResultMeasurementTypeValues = (language: Language): Array<string> =>
  language.isNo
    ? MeasurementResultMeasurementTypeValuesNo
    : MeasurementResultMeasurementTypeValuesEn;

export const MeasurementResultMeasurementMethodValuesNo = [
  'Skyvelær (digitalt)',
  'Skyvelær',
  'Målebånd',
  'Vekt',
  'Presisjonsvekt',
  'Individuell telling',
  'Manuell telling'
];

export const MeasurementResultMeasurementMethodValuesEn = [
  'Digital caliper',
  'Caliper',
  'Tape measure',
  'Portable balance',
  'Precision balance',
  'Individual count',
  'Manual count'
];

const MeasurementResultMeasurementMethodValues = (language: Language): Array<string> =>
  language.isNo
    ? MeasurementResultMeasurementMethodValuesNo
    : MeasurementResultMeasurementMethodValuesEn;

export const MeasurementResultSizeValues = ['mm', 'g.', 'individ', 'stk'];

function getMeasurementValues(era: string, language: Language): Maybe<Array<string>> {
  if (era === 'measurementType') {
    return MeasurementResultMeasurementTypeValues(language);
  }
  if (era === 'method') {
    return MeasurementResultMeasurementMethodValues(language);
  }
  if (era === 'size') {
    return MeasurementResultSizeValues;
  }
  else
    return undefined; //TODO: Is this correct?
}

function getExtractionValues(era: string): Maybe<Array<string>> {
  if (era === 'storageMedium') {
    return ExtractionResultStorageMediumValues;
  }
  if (era === 'volume') {
    return ExtractionResultVolumeValues;
  }
  if (era === 'concentration') {
    return ExtractionResultConcentrationValues;
  }
  else
    return undefined; //TODO: Is this correct?
}

export function getAnalysisResultFieldAllowedValues(
  extraResultType: string,
  era: string,
  language: Language
): Maybe<Array<string>> {
  if (extraResultType === 'ExtractionResult') {
    return getExtractionValues(era);
  }
  if (extraResultType === 'MeasurementResult') {
    return getMeasurementValues(era, language);
  }
  else
    return undefined; //TODO: Is this correct?
}
