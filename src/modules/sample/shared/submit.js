// @flow
import moment from 'moment';
import flatten from 'lodash/flatten';
import Config from '../../../config';
import type { FormDetails } from '../types/form';
import type { Predefined } from '../../../types/predefined';
import type { DomEvent } from '../../../types/dom';
import type { ObjectData } from '../../../types/object';
import type { SampleData } from '../../../types/samples';
import type { AppSession } from '../../../types/appSession';
import type { Person } from '../../../types/person';
import type { SampleType } from '../../../types/sample';
import type { History, Match } from '../../../types/Routes';
import Sample from '../../../models/sample';
import { isFormValid } from '../../../forms/validators';

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

export const sampleProps = (props: Props, doSaveSample: Function) => {
  return {
    objectData: props.objectStore.objectData,
    isFormValid: isFormValid(props.form),
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
    },
    clickSave: (e: DomEvent) => {
      e.preventDefault();
      saveSample(doSaveSample)(
        props.form,
        props.store.sample,
        props.predefined.sampleTypes,
        props.objectStore.objectData,
        props.match.params,
        props.appSession,
        props.history
      );
    }
  };
};

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

function getParentObject(isAdd, sampleData, objectData) {
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
      objectId: sampleData.parentObject.sampleOrObjectData.objectId ||
        sampleData.parentObject.sampleOrObjectData.uuid,
      objectType: sampleData.parentObject.sampleOrObjectData.objectId
        ? 'sample'
        : 'collection'
    };
  }
  return parentObject;
}

const saveSample = doSaveSample => (
  form,
  sampleData,
  sampleTypes,
  objectData,
  params,
  appSession,
  history
) => {
  if (objectData) {
    let parentObject = getParentObject(!form.sampleNum, sampleData, objectData);
    const data = Sample.prepareForSubmit({
      ...normalizeForm(form),
      ...getActors(form.persons.rawValue),
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
    return doSaveSample({
      id: params.sampleId,
      museumId: appSession.museumId,
      token: appSession.accessToken,
      data
    })
      .toPromise()
      .then(value =>
        history.push({
          pathname: Config.magasin.urls.client.analysis.gotoSample(
            appSession,
            value.objectId || value
          )
        })
      );
  }
};

function getSampleTypeId(sampleTypes, sampleType, sampleSubType, appSession) {
  if (!sampleTypes) {
    return null;
  }
  if (sampleSubType) {
    return flatten(Object.values(sampleTypes)).find(subType => {
      const subTypeName = sampleTypeDisplayName(subType, appSession);
      return subTypeName === sampleSubType;
    }).sampleTypeId;
  } else {
    return sampleTypes[sampleType][0].sampleTypeId;
  }
}

function sampleTypeDisplayName(v: SampleType, appSession: AppSession) {
  return appSession.language.isEn
    ? v.enSampleSubType || v.enSampleType
    : v.noSampleSubType || v.noSampleType;
}

function normalizeForm(frm: FormDetails) {
  return Object.keys(frm).reduce(
    (akk: any, key: string) => ({
      ...akk,
      [key]: frm[key].value || frm[key].defaultValue
    }),
    {}
  );
}

function getActors(form: FormDetails) {
  return form.reduce((akk: FormDetails, v: Person) => {
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
