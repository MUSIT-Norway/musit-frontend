// @flow
import {
  getAnalysisResultFieldAllowedValues,
  ExtractionResultStorageMediumValues,
  ExtractionResultVolumeValues,
  ExtractionResultConcentrationValues,
  MeasurementResultMeasurementTypeValuesEn,
  MeasurementResultMeasurementTypeValuesNo,
  MeasurementResultMeasurementMethodValuesNo,
  MeasurementResultMeasurementMethodValuesEn,
  MeasurementResultSizeValues
} from '../analysisResult';

describe('getAnalysisResultFieldAllowedValues', () => {
  it('should return proper allowed values for ExtractionResult and storageMedium', () => {
    const allowedValues = getAnalysisResultFieldAllowedValues(
      'ExtractionResult',
      'storageMedium',
      { isEn: false, isNo: false }
    );
    expect(allowedValues).toEqual(ExtractionResultStorageMediumValues);
  });

  it('should return proper allowed values for ExtractionResult and volume', () => {
    const allowedValues = getAnalysisResultFieldAllowedValues(
      'ExtractionResult',
      'volume',
      { isEn: false, isNo: false }
    );
    expect(allowedValues).toEqual(ExtractionResultVolumeValues);
  });

  it('should return proper allowed values for ExtractionResult and concentration', () => {
    const allowedValues = getAnalysisResultFieldAllowedValues(
      'ExtractionResult',
      'concentration',
      { isEn: false, isNo: false }
    );
    expect(allowedValues).toEqual(ExtractionResultConcentrationValues);
  });

  it('should return english allowed values for ExtractionResult and concentration', () => {
    const allowedValues = getAnalysisResultFieldAllowedValues(
      'MeasurementResult',
      'measurementType',
      { isEn: true, isNo: false }
    );
    expect(allowedValues).toEqual(MeasurementResultMeasurementTypeValuesEn);
  });

  it('should return norwegian allowed values for ExtractionResult and concentration', () => {
    const allowedValues = getAnalysisResultFieldAllowedValues(
      'MeasurementResult',
      'measurementType',
      { isEn: false, isNo: true }
    );
    expect(allowedValues).toEqual(MeasurementResultMeasurementTypeValuesNo);
  });

  it('should return english allowed values for ExtractionResult and method', () => {
    const allowedValues = getAnalysisResultFieldAllowedValues(
      'MeasurementResult',
      'method',
      { isEn: true, isNo: false }
    );
    expect(allowedValues).toEqual(MeasurementResultMeasurementMethodValuesEn);
  });

  it('should return norwegian allowed values for ExtractionResult and method', () => {
    const allowedValues = getAnalysisResultFieldAllowedValues(
      'MeasurementResult',
      'method',
      { isEn: false, isNo: true }
    );
    expect(allowedValues).toEqual(MeasurementResultMeasurementMethodValuesNo);
  });

  it('should return proper allowed values for ExtractionResult and size', () => {
    const allowedValues = getAnalysisResultFieldAllowedValues(
      'MeasurementResult',
      'size',
      { isEn: false, isNo: false }
    );
    expect(allowedValues).toEqual(MeasurementResultSizeValues);
  });
});
