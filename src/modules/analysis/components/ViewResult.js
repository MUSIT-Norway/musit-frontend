// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../../types/appSession';
import type { History } from '../../../types/Routes';
import NavigateToObject from '../../../components/navigations/NavigateToObject';
import { FormText } from '../../../forms/components';

type Props = {
  externalSource: ?string,
  comments: ?string,
  extraAttributes: *,
  history: History,
  appSession: AppSession,
  parentObjectId?: ?string
};

export default function Result(props: Props) {
  return (
    <div>
      {props.extraAttributes &&
        Object.keys(props.extraAttributes)
          .filter(eat => eat !== 'type')
          .map((attrKey: string, i: number) => {
            const attribute = props.extraAttributes[attrKey];
            return (
              <FormText
                key={i}
                id={attrKey}
                label={I18n.t('musit.analysis.analysisExtraResultAttributes.' + attrKey)}
                labelWidth={2}
                elementWidth={5}
                value={
                  attribute.type === 'Size' ? (
                    attribute.value &&
                    attribute.value.rawValue &&
                    attribute.value.rawValue + ' ' + attribute.value.unit
                  ) : (
                    attribute.value && attribute.value
                  )
                }
              />
            );
          })}
      {props.parentObjectId && (
        <NavigateToObject
          className="pull-right"
          objectId={props.parentObjectId}
          appSession={props.appSession}
          history={props.history}
        />
      )}
      <FormText
        id="externalSource"
        label={I18n.t('musit.analysis.externalSource')}
        labelWidth={2}
        elementWidth={5}
        value={props.externalSource}
      />
      <FormText
        id="resultNote"
        label={I18n.t('musit.analysis.commentsToResult')}
        labelWidth={2}
        elementWidth={5}
        value={props.comments}
      />
    </div>
  );
}
