// @flow
import {
  getObjects,
  getAnalysisCollection,
  submitForm,
  getResult
} from '../shared/submit';
import type { Location } from '../shared/submit';
import { simplePost, simplePut } from '../../../shared/RxAjax';
import type { History } from '../../../types/Routes';
import type { AppSession } from '../../../types/appSession';
import type { FormData } from '../shared/formType';
import type { Predefined } from '../shared/predefinedType';
import type { Store } from '../shared/storeType';
import toArray from 'lodash/toArray';
import { isMultipleSelectAttribute } from '../../../types/analysisTypes';
import {
  getAnalysisTypeTerm,
  getAnalysisType,
  getExtraDescriptionAttributes,
  getExtraResultAttributes
} from './getters';

type DomEvent = {
  preventDefault: Function,
  target: { value: string, options?: Array<{ selected: boolean, value: string }> }
};

type Props = {
  updateForm: Function,
  store: Store,
  appSession: AppSession,
  form: FormData,
  history: History,
  predefined: Predefined,
  location: Location,
  updateExtraDescriptionAttribute: Function,
  updateExtraResultAttribute: Function
};

export default (
  props: Props,
  ajaxPost: Function = simplePost,
  ajaxPut: Function = simplePut
) => {
  const analysisType = getAnalysisType(
    parseInt(
      props.store.analysis
        ? props.store.analysis.analysisTypeId
        : props.form.analysisTypeId.value,
      10
    ),
    props.predefined.analysisTypes
  );

  const extraDescriptionAttributes = getExtraDescriptionAttributes(
    analysisType,
    props.store.analysis,
    props.store.extraDescriptionAttributes
  );

  const extraResultAttributes = getExtraResultAttributes(
    analysisType,
    props.store.analysis,
    props.store.extraResultAttributes
  );

  return {
    ...props,
    objects: getObjects(toArray(props.form.events.value), props.location),
    analysisType,
    updateStringField: updateStringField(props.updateForm),
    updateBooleanField: updateBooleanField(props.updateForm),
    updateArrayField: updateArrayField(props.updateForm),
    updateAnalysisCategory: updateAnalysisCategory(props.updateForm),
    updateAnalysisTypeId: updateAnalysisTypeId(props.updateForm),
    analysisTypeTerm: getAnalysisTypeTerm(
      props.store.analysis && props.store.analysis.analysisTypeId,
      props.predefined.analysisTypes,
      props.appSession.language
    ),
    updateExtraDescriptionAttribute: (name: string, type: string) => (evt: DomEvent) => {
      props.updateExtraDescriptionAttribute({
        name,
        value: getExtraAttributeValue(evt, type)
      });
    },
    getExtraDescriptionAttributeValue: (name: string) =>
      extraDescriptionAttributes && extraDescriptionAttributes[name],
    extraDescriptionAttributes: analysisType && analysisType.extraDescriptionAttributes,
    extraResultAttributes: extraResultAttributes,
    updateExtraResultAttribute: (name: string, value: string | number) => {
      props.updateExtraResultAttribute({
        name,
        value
      });
    },
    clickSave: clickSave(
      props.form,
      props.appSession,
      props.history,
      props.location,
      extraDescriptionAttributes,
      extraResultAttributes,
      ajaxPost,
      ajaxPut
    ),
    clickCancel: clickCancel(props)
  };
};

function updateStringField(updateForm) {
  return (name: string) => (evt: DomEvent) =>
    updateForm({
      name,
      rawValue: evt.target.value
    });
}

function updateBooleanField(updateForm) {
  return (name: string, b: boolean) => () =>
    updateForm({
      name,
      rawValue: b
    });
}

function updateArrayField(updateForm) {
  return (name: string) => (evt: DomEvent) =>
    updateForm({
      name,
      rawValue: evt.target.value.split(',').map(v => v.trim())
    });
}

function updateAnalysisCategory(updateForm) {
  return (evt: DomEvent) => {
    updateForm({
      name: 'analysisTypeCategory',
      rawValue: evt.target.value
    });
    updateForm({
      name: 'analysisTypeId',
      rawValue: null
    });
  };
}

function updateAnalysisTypeId(updateForm) {
  return (evt: DomEvent) => {
    updateForm({
      name: 'analysisTypeId',
      rawValue: evt.target.value
    });
  };
}

function parseOption(type) {
  return option => {
    switch (type) {
      case 'Array[Int]':
      case 'Int':
        return parseInt(option.value, 10);
      default:
        return option.value;
    }
  };
}

function clickSave(
  form,
  appSession,
  history,
  location,
  extraDescriptionAttributes,
  extraResultAttributes,
  ajaxPost,
  ajaxPut
) {
  return (evt: DomEvent) => {
    evt.preventDefault();
    submitForm(
      form.id.value,
      getResult(form, extraResultAttributes),
      appSession,
      history,
      getAnalysisCollection(form, extraDescriptionAttributes, location),
      toArray(form.events.value),
      ajaxPost,
      ajaxPut
    );
  };
}

function clickCancel(props) {
  return (evt: DomEvent) => {
    evt.preventDefault();
    props.history.goBack();
  };
}

export function getExtraAttributeValue(evt: DomEvent, type: string) {
  if (evt.target.options) {
    const values = [...evt.target.options]
      .filter(option => option.selected)
      .map(parseOption(type));
    if (isMultipleSelectAttribute(type)) {
      return values;
    }
    if (values.length === 0) {
      return null;
    }
    return values[0];
  }
  return evt.target.value;
}
