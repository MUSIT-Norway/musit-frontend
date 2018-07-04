// @flow
import * as React from "react";
import { ChangeEventHandler } from "react";
import { I18n } from "react-i18nify";
import { ElementProps } from "../../../forms/components";
import { FormElement } from "../../../forms/components";
import { AnalysisType } from "../../../types/analysis";
import { Language } from "../../../types/appSession";
import { Maybe, Star } from "../../../types/common";

export type Props = ElementProps & {
  id: string;
  categories: Maybe<{ [key: string]: Star }>;
  category: Maybe<string>;
  onChangeCategory: ChangeEventHandler<HTMLElement>;
  types: Maybe<Array<AnalysisType>>;
  type: Maybe<string>;
  onChangeType: ChangeEventHandler<HTMLElement>;
  language: Language;
};

export default function FormAnalysisType(props: Props) {
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
      hasError={props.hasError}
    >
      <AnalysisTypeSelect {...props} />
    </FormElement>
  );
}

function AnalysisTypeSelect(props: Props) {
  return (
    <div className="row">
      <div className="col-md-6">
        <select
          id={props.id}
          className="form-control"
          value={props.category || ""}
          onChange={props.onChangeCategory}
        >
          <option value="">{I18n.t("musit.analysis.chooseCategory")}</option>
          {props.categories &&
            Object.keys(props.categories).map(k => (
              <option key={k} value={k}>
                {I18n.t(`musit.analysis.category.${k}`)}
              </option>
            ))}
        </select>
      </div>
      {props.category &&
      props.category !== "0" && (
        <div className="col-md-6">
          <select
            id={`sub${props.id}`}
            className="form-control"
            value={props.type || ""}
            onChange={props.onChangeType}
          >
            <option value="">{I18n.t("musit.analysis.chooseType")}</option>
            {props.types &&
              props.types.filter(b => b.category.toString() === props.category).map(a => (
                <option key={a.id} value={a.id}>
                  {props.language.isEn ? a.enName : a.noName}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
}
