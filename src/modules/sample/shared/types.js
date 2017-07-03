// @flow

import type { SampleTypesObject, SampleType } from '../../../types/sample';
import type { AppSession } from '../../../types/appSession';

const findSampleType = (sampleTypes: SampleTypesObject, sampleTypesId: number) =>
  sampleTypes.sampleTypes.find(f => f.sampleTypeId === sampleTypesId);

export const getSampleType = (
  sampleTypes: SampleTypesObject,
  sampleTypesId: number,
  appSession: AppSession
) => {
  if (sampleTypes && sampleTypes.sampleTypes && sampleTypesId) {
    const sampleTypeFound: ?SampleType = findSampleType(sampleTypes, sampleTypesId);
    if (sampleTypeFound) {
      return appSession.language.isEn
        ? sampleTypeFound.enSampleType
        : sampleTypeFound.noSampleType;
    }
  }
  return '';
};

export const getSampleSubType = (
  sampleTypes: SampleTypesObject,
  sampleTypesId: number,
  appSession: AppSession
): string => {
  if (sampleTypes && sampleTypes.sampleTypes && sampleTypesId) {
    const sampleTypeFound: ?SampleType = findSampleType(sampleTypes, sampleTypesId);

    if (sampleTypeFound) {
      return (
        (appSession.language.isEn
          ? sampleTypeFound.enSampleSubType
          : sampleTypeFound.noSampleSubType) || ''
      );
    }
  }
  return '';
};

export const getSampleSubTypeWithSlash = (
  sampleTypes: SampleTypesObject,
  sampleTypesId: number,
  appSession: AppSession
) => {
  const subType = getSampleSubType(sampleTypes, sampleTypesId, appSession);
  if (subType) {
    return ' / ' + subType;
  }
  return '';
};

export const getSampleTypeAndSubType = (
  sampleTypes: SampleTypesObject,
  sampleTypesId: number,
  appSession: AppSession
) => {
  const sampleType = getSampleType(sampleTypes, sampleTypesId, appSession);
  const sampleSubType = getSampleSubType(sampleTypes, sampleTypesId, appSession);
  if (sampleSubType) {
    return sampleType + ' / ' + sampleSubType;
  }
  return sampleType ? sampleType : '';
};
