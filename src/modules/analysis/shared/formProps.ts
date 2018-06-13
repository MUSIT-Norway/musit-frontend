// @flow
import { getObjects, getAnalysisCollection, getResult } from "../shared/submit";
import { saveAnalysis$ } from "../analysisStore";
import { Location } from "../shared/submit";
import { simplePost, simplePut } from "../../../shared/RxAjax";
import { History } from "history";
import { AppSession } from "../../../types/appSession";
import { FormData } from "../shared/formType";
import { Predefined } from "../../../types/predefined";
import { Store } from "../shared/storeType";
import { DomEvent } from "../../../types/dom";
import { toArray } from "lodash";
import { isMultipleSelectAttribute } from "../../../types/analysis";
import { Restriction, AnalysisEvent } from "../../../types/analysis";
import {
  getAnalysisTypeTerm,
  getAnalysisType,
  getExtraDescriptionAttributes,
  getExtraResultAttributes
} from "./getters";
import { isFormValid } from "../../../forms/validators";
import {
  AnalysisType,
  Size,
  ExtraResultAttribute,
  ExtraResultAttributeValues
} from "../../../types/analysis";
import { emitError } from "../../../shared/errors";
import Config from "../../../config";
import { Exact, Maybe, MUSTFIX, TODO } from "../../../types/common";

type FormProps = Exact<{
  updateForm: Function;
  store: Store;
  appSession: AppSession;
  form: FormData;
  history: History;
  predefined: Predefined;
  location: Location<Array<AnalysisEvent>>;
  updateExtraDescriptionAttribute: Function;
  updateExtraResultAttribute: Function;
}>;

export default function formProps(
  props: FormProps,
  ajaxPost: Function = simplePost,
  ajaxPut: Function = simplePut
) {
  const analysisType: Maybe<AnalysisType> = getAnalysisType(
    parseInt(
      (props.store.analysis
        ? props.store.analysis.analysisTypeId
        : props.form.analysisTypeId.value) as MUSTFIX,
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
    props.store.extraResultAttributes,
    props.appSession.language
  );

  return {
    ...props,
    isFormValid: isFormValid(props.form) && isResultValid(analysisType, extraResultAttributes),
    isRestrictionValidForCancellation: isRestrictionValidForCancellation(
      props.form.restriction.value
    ),
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
    extraDescriptionAttributes: (analysisType && analysisType.extraDescriptionAttributes) || [],
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
}

export function isRestrictionValidForCancellation(restriction: Maybe<Restriction>): boolean {
  return !!(
    restriction &&
    restriction.cancelledReason &&
    restriction.cancelledReason.trim().length > 0 &&
    restriction.cancelledBy &&
    restriction.cancelledBy.trim().length > 0
  );
}

function updateStringField(updateForm: TODO) {
  return (name: string) => (evt: DomEvent) =>
    updateForm({
      name,
      rawValue: evt.target.value
    });
}

function updateBooleanField(updateForm: TODO) {
  return (name: string, b: boolean) => () =>
    updateForm({
      name,
      rawValue: b
    });
}

function updateArrayField(updateForm: TODO) {
  return (name: string) => (evt: DomEvent) =>
    updateForm({
      name,
      rawValue: evt.target.value.split(",").map(v => v.trim())
    });
}

function updateAnalysisCategory(updateForm: TODO) {
  return (evt: DomEvent) => {
    updateForm({
      name: "analysisTypeCategory",
      rawValue: evt.target.value
    });
    updateForm({
      name: "analysisTypeId",
      rawValue: null
    });
  };
}

function updateAnalysisTypeId(updateForm: TODO) {
  return (evt: DomEvent) => {
    updateForm({
      name: "analysisTypeId",
      rawValue: evt.target.value
    });
  };
}

function parseOption(type: TODO) {
  return (option:TODO) => {
    switch (type) {
      case "Array[Int]":
      case "Int":
        return parseInt(option.value, 10);
      default:
        return option.value;
    }
  };
}

type OnUnmountProps = {
  clearForm: Function;
  clearStore: Function;
};

export const onUnmount = (props: OnUnmountProps) => {
  props.clearForm();
  props.clearStore();
};

function clickSave(
  form: TODO,
  appSession: AppSession,
  history: History,
  location: TODO,
  extraDescriptionAttributes: TODO,
  extraResultAttributes: TODO,
  ajaxPost: TODO,
  ajaxPut: TODO
) {
  return (evt: DomEvent) => {
    evt.preventDefault();
    saveAnalysis$.next({
      id: form.id.value,
      result: getResult(form, extraResultAttributes) as TODO,
      appSession,
      data: getAnalysisCollection(form, extraDescriptionAttributes, location),
      events: toArray(form.events.value),
      ajaxPost,
      ajaxPut,
      callback: {
        onComplete: (props:TODO) => {
          if (!props) {
            return;
          }
          const maybeErrorMessage = props.results
            .filter((res: TODO) => res.error)
            .concat(props.badFiles)
            .map((res: TODO) => res.error.xhr.response.message)
            .join("\n")
            .trim();
          if (maybeErrorMessage.length > 0) {
            emitError({
              type: "errorOnSave",
              message: maybeErrorMessage.replace("in None", "")
            });
          }
          const id = props.id;
          history.replace(
            Config.magasin.urls.client.analysis.viewAnalysis(appSession, parseInt(id, 10))
          );
        }
      }
    });
  };
}

function clickCancel(props: TODO) {
  return (evt: DomEvent) => {
    evt.preventDefault();
    props.history.goBack();
  };
}

export function getExtraAttributeValue(evt: DomEvent, type: string) {
  if (evt.target.options) {
    const values = [...evt.target.options].filter(option => option.selected).map(parseOption(type));
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

function isResultValid(
  analysisType?: Maybe<AnalysisType>,
  resultAttributes?: Maybe<ExtraResultAttributeValues>
): boolean {
  if (!analysisType) {
    return false;
  }
  const extraResultAttributes = analysisType.extraResultAttributes;
  if (!extraResultAttributes) {
    return true;
  }
  const keys: Array<string> = Object.keys(extraResultAttributes);
  return keys.reduce((resultValid: boolean, attributeKey: string) => {
    const attributeValid: boolean = isResultAttributeValid(
      extraResultAttributes && extraResultAttributes[attributeKey],
      resultAttributes && resultAttributes[attributeKey]
    );
    return resultValid && attributeValid;
  }, true);
}

function isResultAttributeValid(type?: Maybe<string>, attr?: Maybe<ExtraResultAttribute>): boolean {
  if (!attr || !(attr as MUSTFIX).value) {
    return true;
  }
  if (type === "String") {
    return typeof (attr as MUSTFIX).value === "string" && (attr as MUSTFIX).value.length > 0;
  }
  if (type === "Int") {
    return typeof (attr as MUSTFIX).value === "number";
  }
  if (type === "Size") {
    if (!attr) {
      return false;
    }
    const size: Maybe<Size> = (attr as MUSTFIX).value as any;
    if (!size) {
      return false;
    }
    return !!(size.value && size.unit);
  }
  return true;
}
