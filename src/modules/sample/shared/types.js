// @flow

import type { SampleTypesObject, SampleType } from '../../../types/sample';
import type { SampleData } from '../../../types/samples';
import type { ObjectData } from '../../../types/object';
import type { AppSession } from '../../../types/appSession';

const findSampleType = (sampleTypes: SampleTypesObject, sampleTypesId: number) =>
  sampleTypes.sampleTypes.find(f => f.sampleTypeId === sampleTypesId);

export const getSampleTypeObj = (
  sampleTypes: SampleTypesObject,
  sampleTypesId: number
) => {
  if (sampleTypes && sampleTypes.sampleTypes && sampleTypesId) {
    const sampleTypeFound: ?SampleType = findSampleType(sampleTypes, sampleTypesId);
    if (sampleTypeFound) {
      return sampleTypeFound;
    }
  }
  return null;
};

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
  sampleTypes: Array<SampleType>,
  sampleTypesId: number,
  appSession: AppSession
) => {
  const sampleTypesObj = { sampleTypes };
  const sampleType = getSampleType(sampleTypesObj, sampleTypesId, appSession);
  const sampleSubType = getSampleSubType(sampleTypesObj, sampleTypesId, appSession);
  if (sampleSubType) {
    return sampleType + ' / ' + sampleSubType;
  }
  return sampleType ? sampleType : '';
};

export type FlattenedSampleObject = any;

export function flattenSample(
  appSession: AppSession,
  sampleTypes: Array<SampleType>,
  objectData: ObjectData,
  sampleData: SampleData
): FlattenedSampleObject {
  const sampleWithTypeInfo = {
    id: sampleData.objectId,
    uuid: sampleData.objectId,
    objectId: sampleData.objectId,
    objectType: 'sample',
    collection: appSession.collectionId,
    museumNo: objectData.museumNo,
    subNo: objectData.subNo,
    term: objectData.term,
    sampleNum: sampleData.sampleNum,
    sampleTypeAndSubType: getSampleTypeAndSubType(
      sampleTypes,
      sampleData.sampleTypeId,
      appSession
    ),
    sampleType: getSampleTypeObj({ sampleTypes: sampleTypes }, sampleData.sampleTypeId),
    sampleTypeId: sampleData.sampleTypeId
  };
  return {
    ...objectData,
    ...sampleWithTypeInfo,
    sampleType: getSampleType(
      { sampleTypes: sampleTypes },
      sampleData.sampleTypeId,
      appSession
    ),
    sampleSubType: getSampleSubType(
      { sampleTypes: sampleTypes },
      sampleData.sampleTypeId,
      appSession
    ),
    objectData: objectData,
    sampleData: sampleWithTypeInfo
  };
}
