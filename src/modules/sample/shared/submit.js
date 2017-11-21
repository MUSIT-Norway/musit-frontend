// @flow
import moment from 'moment';
import flatten from 'lodash/flatten';
import Config from '../../../config';
import type { FormDetails } from '../types/form';
import type { Predefined, SampleTypes } from '../../../types/predefined';
import type { DomEvent } from '../../../types/dom';
import type { ObjectData } from '../../../types/object';
import type { SampleData } from '../../../types/samples';
import type { AppSession } from '../../../types/appSession';
import type { Person } from '../../../types/person';
import type { SampleType } from '../../../types/sample';
import type { History, Match } from '../../../types/Routes';
import Sample from '../../../models/sample';
import { isFormValid } from '../../../forms/validators';
import { I18n } from 'react-i18nify';
import { emitError, emitSuccess } from '../../../shared/errors';

function getSampleSubTypes(sampleType, sampleTypes) {
  return sampleType && sampleTypes && sampleTypes[sampleType];
}

type Props = {
  form: FormDetails,
  predefined: Predefined,
  appSession: AppSession,
  updateForm: Function,
  objectStore: { objectData?: ?ObjectData },
  history: History,
  match: Match<{ sampleId: number }>,
  store: { sample?: ?SampleData }
};

export const sampleProps = (props: Props) => {
  return {
    isFormValid: isFormValid(props.form),
    showSampleSubType: showSampleSubType(
      props.form.sampleType.rawValue ? props.form.sampleType.rawValue.toString() : null,
      props.predefined.sampleTypes
    ),
    canEditSampleType: !props.form.sampleNum,
    updateSampleType: updateSampleType(
      props.form,
      props.appSession,
      props.predefined.sampleTypes,
      props.updateForm
    ),
    sampleTypeDisplayName,
    goBack: (e: DomEvent) => {
      e.preventDefault();
      props.history.goBack();
    }
  };
};

/**
 * returns true if sampleType has value and the sampleType exists in sampleTypes from store (backend).
 * else undefined.
 *
 * @param sampleTypeStr
 * @param sampleTypes
 * @returns {boolean}
 */
function showSampleSubType(sampleTypeStr: ?string, sampleTypes: ?any): boolean {
  return !!(
    sampleTypeStr &&
    sampleTypeStr.trim().length > 0 &&
    sampleTypes &&
    sampleTypes[sampleTypeStr] &&
    sampleTypes[sampleTypeStr].length > 1
  );
}

function updateSampleType(
  form,
  appSession: AppSession,
  sampleTypes,
  updateForm: Function
) {
  return (obj: { rawValue?: ?string }) => {
    const sampleSubTypes = getSampleSubTypes(obj.rawValue, sampleTypes);
    if (sampleSubTypes && sampleSubTypes.length === 1) {
      updateForm({
        name: form.sampleSubType.name,
        rawValue: sampleTypeDisplayName(sampleSubTypes[0], appSession)
      });
    } else {
      updateForm({ name: form.sampleSubType.name, rawValue: '' });
    }
    updateForm(obj);
  };
}

function getParentObject(
  isAdd: boolean,
  sampleData: ?SampleData,
  objectData: ObjectData
) {
  let parentObject;
  const isEdit = !isAdd;
  if (isAdd) {
    if (sampleData) {
      parentObject = {
        objectId: sampleData.objectId,
        objectType: 'sample'
      };
    } else {
      parentObject = {
        objectType: objectData.objectType,
        objectId: objectData.uuid
      };
    }
  } else if (
    isEdit &&
    sampleData &&
    sampleData.parentObject &&
    sampleData.parentObject.sampleOrObjectData
  ) {
    parentObject = {
      objectId:
        sampleData.parentObject.sampleOrObjectData.objectId ||
        sampleData.parentObject.sampleOrObjectData.uuid,
      objectType: sampleData.parentObject.sampleOrObjectData.objectId
        ? 'sample'
        : 'collection'
    };
  }
  return parentObject;
}

export const callback = {
  onComplete: () => {
    emitSuccess({
      type: 'saveSuccess',
      message: I18n.t('musit.sample.saveSampleSuccess')
    });
  },
  onFailure: (e: *) => {
    emitError({
      type: 'errorOnSave',
      error: e,
      message: I18n.t('musit.sample.saveSampleError')
    });
  }
};

export const onComplete = (history: History, appSession: AppSession) => (value: {
  response: { objectId?: string } | string
}) => {
  const objectId: ?string =
    typeof value.response === 'string' ? value.response : value.response.objectId;
  if (objectId) {
    history.push({
      pathname: Config.magasin.urls.client.analysis.gotoSample(appSession, objectId)
    });
  }
};

export const getSampleData = function(
  form: FormDetails,
  sampleData: ?SampleData,
  objectData: ObjectData,
  sampleTypes: SampleTypes,
  appSession: AppSession
) {
  const parentObject = getParentObject(!form.sampleNum, sampleData, objectData);
  return Sample.prepareForSubmit({
    ...normalizeForm(form),
    ...getActors(Array.isArray(form.persons.rawValue) ? form.persons.rawValue : []),
    sizeUnit: form.sizeUnit.value,
    externalId: form.externalId.value,
    externalIdSource: form.externalIdSource.value,
    sampleTypeId: getSampleTypeId(
      sampleTypes,
      form.sampleType.value,
      form.sampleSubType.value,
      appSession
    ),
    originatedObjectUuid: objectData.uuid,
    parentObject: parentObject,
    museumId: appSession.museumId
  });
};

export const saveSample = (doSaveSample: Function) => (
  form: FormDetails,
  sampleData: ?SampleData,
  sampleTypes: SampleTypes,
  objectData: ?ObjectData,
  params: { sampleId: ?string },
  appSession: AppSession,
  history: History,
  callback: { onComplete: Function, onFailure: Function },
  onComplete: Function
) => {
  if (objectData) {
    const data = getSampleData(form, sampleData, objectData, sampleTypes, appSession);
    return doSaveSample({
      id: params.sampleId,
      museumId: appSession.museumId,
      token: appSession.accessToken,
      data,
      callback
    })
      .toPromise()
      .then(onComplete);
  }
};

function getSampleTypeId(
  sampleTypes: SampleTypes,
  sampleType: ?string,
  sampleSubType?: ?string,
  appSession: AppSession
): ?number {
  if (!sampleTypes) {
    return null;
  }
  if (sampleSubType) {
    const sampleTypeFound: ?any = flatten(
      Object.values(sampleTypes)
    ).find((subType: any) => {
      const subTypeName = sampleTypeDisplayName(subType, appSession);
      return subTypeName === sampleSubType;
    });
    return sampleTypeFound ? sampleTypeFound.sampleTypeId : null;
  } else {
    return sampleType && sampleTypes && sampleTypes
      ? sampleTypes[sampleType][0].sampleTypeId
      : null;
  }
}

function sampleTypeDisplayName(v: SampleType, appSession: AppSession) {
  return appSession.language.isEn
    ? v.enSampleSubType || v.enSampleType
    : v.noSampleSubType || v.noSampleType;
}

function normalizeForm(frm: FormDetails): { [string]: * } {
  const keys: Array<string> = Object.keys(frm);
  return keys.reduce(
    (akk: { [string]: * }, key: string) => ({
      ...akk,
      [key]: frm[key].value || frm[key].defaultValue
    }),
    {}
  );
}

export type ExtraActorInfo = {
  doneByStamp?: { user: ?string, date: string },
  responsible?: string
};

function getActors(persons: Array<Person>): ExtraActorInfo {
  return persons.reduce((akk: ExtraActorInfo, v: Person) => {
    switch (v.role) {
      case 'creator':
        return {
          ...akk,
          doneByStamp: {
            user: v.uuid,
            date: moment(v.date).format()
          }
        };
      case 'responsible':
        return {
          ...akk,
          responsible: v.uuid
        };
      default:
        return {};
    }
  }, {});
}
