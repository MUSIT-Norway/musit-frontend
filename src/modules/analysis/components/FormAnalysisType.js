// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { DomEvent } from '../../../types/dom';
import type { ElementProps } from '../../../forms/components';
import { FormElement } from '../../../forms/components';
import type { AnalysisType } from '../../../types/analysis';
import type { Language } from '../../../types/appSession';

export type Props = ElementProps & {
  id: string,
  categories: ?{ [string]: * },
  category: ?string,
  onChangeCategory: (e: DomEvent) => void,
  types: ?Array<AnalysisType>,
  type: ?string,
  onChangeType: (e: DomEvent) => void,
  language: Language
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
          value={props.category || ''}
          onChange={props.onChangeCategory}
        >
          <option value="">{I18n.t('musit.analysis.chooseCategory')}</option>
          {props.categories &&
            Object.keys(props.categories).map(k => (
              <option key={k} value={k}>
                {I18n.t(`musit.analysis.category.${k}`)}
              </option>
            ))}
        </select>
      </div>
      {props.category &&
        props.category !== '0' && (
          <div className="col-md-6">
            <select
              id={`sub${props.id}`}
              className="form-control"
              value={props.type || ''}
              onChange={props.onChangeType}
            >
              <option value="">{I18n.t('musit.analysis.chooseType')}</option>
              {props.types &&
                props.types
                  .filter(b => b.category.toString() === props.category)
                  .map(a => (
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
