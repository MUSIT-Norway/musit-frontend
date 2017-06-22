import moment from 'moment';
import flatten from 'lodash/flatten';
import Config from '../../../config';
import type { FormDetails } from '../types/form';
import Sample from '../../../models/sample';

export const sampleProps = (props, doSaveSample) => {
  return {
    objectData: props.location.state[0],
    isFormValid: Object.keys(props.form).reduce((acc, k) => {
      const field = props.form[k];
      return acc && field.status.valid;
    }, true),
    sampleTypeDisplayName,
    goBack: e => {
      e.preventDefault();
      props.history.goBack();
    },
    clickSave: e => {
      e.preventDefault();
      saveSample(doSaveSample)(
        props.form,
        props.store,
        props.location.state[0],
        props.match.params,
        props.appSession,
        props.history
      );
    }
  };
};

const saveSample = doSaveSample => (
  form,
  store,
  objectData,
  params,
  appSession,
  history
) => {
  const data = Sample.prepareForSubmit({
    ...normalizeForm(form),
    ...getActors(form.persons.rawValue),
    sampleTypeId: getSampleTypeId(
      store.sampleTypes,
      form.sampleSubType.value,
      appSession
    ),
    originatedObjectUuid: objectData.uuid,
    parentObject: {
      objectType: objectData.objectType,
      objectId: params.objectId ||
        (form.originatedObjectUuid ? form.originatedObjectUuid.value : null)
    },
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
        ),
        state: [objectData]
      })
    );
};

function getSampleTypeId(sampleTypes, selectSubType, appSession) {
  if (!sampleTypes) {
    return null;
  }
  return flatten(Object.values(sampleTypes)).find(subType => {
    const subTypeName = sampleTypeDisplayName(subType, appSession);
    return subTypeName === selectSubType;
  }).sampleTypeId;
}

function sampleTypeDisplayName(v, appSession) {
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

function getActors(form: any) {
  return form.reduce((akk: any, v: Person) => {
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
