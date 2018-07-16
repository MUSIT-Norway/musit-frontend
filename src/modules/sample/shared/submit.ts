// @flow
import * as moment from 'moment';
import { flatten } from 'lodash';
import Config from '../../../config';
import { FormDetails } from '../types/form';
import { Predefined, SampleTypes } from '../../../types/predefined';
import { DomEvent } from '../../../types/dom';
import { ObjectData } from '../../../types/object';
import { SampleData } from '../../../types/samples';
import { AppSession } from '../../../types/appSession';
import { Person } from '../../../types/person';
import { SampleType } from '../../../types/sample';
import { Match } from '../../../types/Routes';
import Sample from '../../../models/sample';
import { isFormValid } from '../../../forms/validators';
import { I18n } from 'react-i18nify';
import { emitError, emitSuccess } from '../../../shared/errors';
import { History } from 'history';
import { TODO, Maybe, Star, BUG } from '../../../types/common';

function getSampleSubTypes(sampleType: TODO, sampleTypes: TODO) {
  return sampleType && sampleTypes && sampleTypes[sampleType];
}

type Props = {
  form: FormDetails;
  predefined: Predefined;
  appSession: AppSession;
  updateForm: Function;
  objectStore: { objectData?: Maybe<ObjectData> };
  history: History;
  match: Match<{ sampleId: number }>;
  store: { sample?: Maybe<SampleData> };
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
function showSampleSubType(
  sampleTypeStr: Maybe<string>,
  sampleTypes: Maybe<any>
): boolean {
  return !!(
    sampleTypeStr &&
    sampleTypeStr.trim().length > 0 &&
    sampleTypes &&
    sampleTypes[sampleTypeStr] &&
    sampleTypes[sampleTypeStr].length > 1
  );
}

function updateSampleType(
  form: TODO,
  appSession: AppSession,
  sampleTypes: TODO,
  updateForm: Function
) {
  return (obj: { rawValue?: Maybe<string> }) => {
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
  sampleData: Maybe<SampleData>,
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
  onFailure: (e: Star) => {
    emitError({
      type: 'errorOnSave',
      error: e,
      message: I18n.t('musit.sample.saveSampleError')
    });
  }
};

export const onComplete = (history: History, appSession: AppSession) => (value: {
  response: { objectId?: string } | string;
}) => {
  const objectId: Maybe<string> =
    typeof value.response === 'string' ? value.response : value.response.objectId;
  if (objectId) {
    history.push({
      pathname: Config.magasin.urls.client.analysis.gotoSample(appSession, objectId)
    });
  }
};

export const getSampleData = function(
  form: FormDetails,
  sampleData: Maybe<SampleData>,
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
    parentObject: parentObject as BUG, //getParentObject() may return undefined, but that doesn't seem to be handled properly here
    museumId: appSession.museumId
  });
};

export const saveSample = (doSaveSample: Function) => (
  form: FormDetails,
  sampleData: Maybe<SampleData>,
  sampleTypes: SampleTypes,
  objectData: Maybe<ObjectData>,
  params: { sampleId: Maybe<string> },
  appSession: AppSession,
  history: History,
  callback: { onComplete: Function; onFailure: Function },
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
  sampleType: Maybe<string>,
  sampleSubType: Maybe<string>,
  appSession: AppSession
): Maybe<number> {
  if (!sampleTypes) {
    return null;
  }
  if (sampleSubType) {
    const sampleTypeFound: Maybe<any> = flatten(Object.values(sampleTypes)).find(
      (subType: any) => {
        const subTypeName = sampleTypeDisplayName(subType, appSession);
        return subTypeName === sampleSubType;
      }
    );
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

function normalizeForm(frm: FormDetails): { [key: string]: Star } {
  const keys: Array<string> = Object.keys(frm);
  return keys.reduce(
    (akk: { [key: string]: Star }, key: string) => ({
      ...akk,
      [key]: frm[key].value || frm[key].defaultValue
    }),
    {}
  );
}

export type ExtraActorInfo = {
  doneByStamp?: { user: Maybe<string>; date: string };
  responsible?: string;
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
