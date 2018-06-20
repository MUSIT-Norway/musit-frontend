// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../../types/appSession';
import type { History } from '../../../types/Routes';
import NavigateToObject from '../../../components/navigations/NavigateToObject';
import { FormText, FormElement } from '../../../forms/components';
import type { ErrorLoading, SavedFile } from '../../../models/analysis/analysisResult';
import { saveBlob } from '../../../shared/download';
import { getFileAsBlob } from '../../../models/analysis/analysisResult';

type Props = {
  files: ?Array<SavedFile | ErrorLoading>,
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
            const attribute: any = props.extraAttributes[attrKey];
            return (
              <FormText
                key={i}
                id={attrKey}
                label={I18n.t('musit.analysis.analysisExtraResultAttributes.' + attrKey)}
                labelWidth={2}
                elementWidth={5}
                value={
                  attribute && attribute.type && attribute.type === 'Size'
                    ? attribute.value &&
                      attribute.value.rawValue &&
                      attribute.value.rawValue + ' ' + attribute.value.unit
                    : attribute.value && attribute.value
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
      <FormElement id="files" label={'Files'} labelWidth={2} elementWidth={5}>
        <p className="form-control-static">
          {Array.isArray(props.files) &&
            props.files.map(file => {
              if (file.error) {
                return null;
              }
              const fid = file.fid;
              const title = file.title;
              return (
                <p key={fid}>
                  <button
                    className="btn-link"
                    onClick={e => {
                      e.preventDefault();
                      getFileAsBlob(
                        fid,
                        props.appSession.museumId,
                        props.appSession.accessToken
                      )
                        .do(res => {
                          if (res instanceof Blob) {
                            saveBlob(res, title);
                          }
                        })
                        .toPromise();
                    }}
                  >
                    {file.title}
                  </button>
                </p>
              );
            })}
        </p>
      </FormElement>
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
