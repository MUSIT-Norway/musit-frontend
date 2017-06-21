// @flow
import {
  getAnalysisTypeTerm,
  getObjects,
  getAnalysisType,
  getAnalysisCollection,
  submitForm,
  getResult
} from '../shared/submit';
import type { Location } from '../shared/submit';
import { simplePost, simplePut } from '../../../shared/RxAjax';
import type { ExtraResultAttributeValues } from '../../../types/analysisTypes';
import type { History } from '../../../types/Routes';
import type { AppSession } from '../../../types/appSession';
import type { FormData } from '../shared/formType';
import type { Predefined } from '../shared/predefinedType';
import type { Store } from '../shared/storeType';
import toArray from 'lodash/toArray';

type DomEvent = {
  preventDefault: Function,
  target: { value: string, options?: HTMLOptionsCollection }
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
  const extraAttributesFromApi =
    props.store.analysis && props.store.analysis.extraAttributes;
  const extraAttributes = {
    ...extraAttributesFromApi,
    ...props.store.extraDescriptionAttributes,
    type: analysisType
      ? analysisType.extraDescriptionType
      : extraAttributesFromApi && extraAttributesFromApi.type
  };

  function getApiResult(
    name,
    type,
    result
  ): ?string | ?number | ?{ value: number, unit: string, rawValue: ?string } {
    const value = result && result[name];
    if (
      value &&
      type === 'Size' &&
      typeof value !== 'number' &&
      typeof value !== 'string'
    ) {
      return {
        ...value,
        rawValue: value.value ? value.value.toString().replace('.', ',') : null
      };
    }
    return value && value.toString();
  }

  const extraResultAttributes: ExtraResultAttributeValues = analysisType &&
    analysisType.extraResultAttributes
    ? Object.keys(analysisType.extraResultAttributes).reduce(
        (acc, era) => {
          const type =
            analysisType.extraResultAttributes && analysisType.extraResultAttributes[era];
          const value = props.store.extraResultAttributes &&
            props.store.extraResultAttributes[era]
            ? props.store.extraResultAttributes[era]
            : props.store.analysis
                ? getApiResult(era, type, props.store.analysis.result)
                : null;
          return {
            ...acc,
            [era]: {
              type,
              value
            }
          };
        },
        {
          type: analysisType.extraDescriptionType &&
            analysisType.extraDescriptionType.replace('Attributes', 'Result')
        }
      )
    : { type: null };
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
      props.store.analysis,
      props.predefined.analysisTypes,
      props.appSession.language
    ),
    updateExtraDescriptionAttribute: (name: string, type: string) => (evt: DomEvent) => {
      props.updateExtraDescriptionAttribute({
        name,
        value: getExtraAttributeValue(evt, type)
      });
    },
    getExtraDescriptionAttributeValue: (name: string) => extraAttributes[name],
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
      extraAttributes,
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
  extraAttributes,
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
      getAnalysisCollection(form, extraAttributes, location),
      ([].concat(form.events.value): any), // flow sucks, or some other reason why I cannot get around this.
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

function getExtraAttributeValue(evt, type) {
  if (evt.target.options) {
    return [...evt.target.options]
      .filter(option => option.selected)
      .map(parseOption(type));
  }
  return evt.target.value;
}
