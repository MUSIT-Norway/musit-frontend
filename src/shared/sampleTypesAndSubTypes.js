// @flow

import type { SampleTypesObject, SampleTypes, SampleType } from '../types/sampleTypes';
import type { AppSession } from '../types/appSession';

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
) => {
  if (sampleTypes && sampleTypes.sampleTypes && sampleTypesId) {
    const sampleTypeFound: ?SampleType = findSampleType(sampleTypes, sampleTypesId);

    if (sampleTypeFound) {
      return appSession.language.isEn
        ? sampleTypeFound.enSampleSubType
        : sampleTypeFound.noSampleSubType;
    }
  }
  return '';
};
