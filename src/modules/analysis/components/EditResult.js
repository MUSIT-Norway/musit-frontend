// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../../types/appSession';
import type { History } from '../../../types/Routes';
import NavigateToObject from '../../../components/navigations/NavigateToObject';
import ExtraResultAttribute from './ExtraResultAttribute';
import { FormInput, FormTextArea, FormFileSelect } from '../../../forms/components';

type Props = {
  externalSource: ?string,
  updateExternalSource: (value: string) => void,
  comments: ?string,
  updateComments: (value: string) => void,
  extraAttributes: any,
  updateExtraResultAttribute: Function,
  resultFiles: ?Array<File>,
  updateResultFiles: (files: Array<File>) => void,
  history: History,
  appSession: AppSession,
  parentObjectId?: ?string
};

export default function EditResult(props: Props) {
  return (
    <div>
      {props.extraAttributes &&
        Object.keys(props.extraAttributes)
          .filter(eat => eat !== 'type')
          .map((attrKey: string, i: number) => {
            let attribute = props.extraAttributes[attrKey];
            return (
              <ExtraResultAttribute
                key={i}
                id={attrKey}
                label={I18n.t('musit.analysis.analysisExtraResultAttributes.' + attrKey)}
                labelWidth={2}
                elementWidth={5}
                onChange={value => props.updateExtraResultAttribute(attrKey, value)}
                value={attribute.value}
                type={attribute.type}
                allowedValues={attribute.allowedValues}
              />
            );
          })}
      {props.parentObjectId && (
        <NavigateToObject
          objectId={props.parentObjectId}
          appSession={props.appSession}
          history={props.history}
          className="pull-right"
        />
      )}
      <FormInput
        id="externalSource"
        label={I18n.t('musit.analysis.externalSource')}
        labelWidth={2}
        elementWidth={5}
        value={props.externalSource || ''}
        onChange={e => props.updateExternalSource(e.target.value)}
      />
      <FormFileSelect
        id="resultFiles"
        label={I18n.t('musit.analysis.resultFiles')}
        labelWidth={2}
        elementWidth={5}
        value={props.resultFiles}
        multiple={true}
        onChange={files => props.updateResultFiles(files)}
      />
      <FormTextArea
        id="resultNote"
        label={I18n.t('musit.analysis.commentsToResult')}
        labelWidth={2}
        elementWidth={5}
        value={props.comments || ''}
        onChange={e => props.updateComments(e.target.value)}
        rows={5}
      />
    </div>
  );
}
