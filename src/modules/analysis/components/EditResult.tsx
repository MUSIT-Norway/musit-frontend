// @flow
import * as React from 'react';
import { I18n } from 'react-i18nify';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import NavigateToObject from '../../../components/navigations/NavigateToObject';
import ExtraResultAttribute from './ExtraResultAttribute';
import { FormInput, FormTextArea, FormFileSelect } from '../../../forms/components';
import { FormElement } from '../../../forms/components';
import { saveBlob } from '../../../shared/download';
import { getFileAsBlob } from '../../../models/analysis/analysisResult';
import { Maybe, TODO } from '../../../types/common';
import { ErrorLoading, SavedFile, isErrorLoading } from '../../../types/documentsCommon';

type Props = {
  externalSource: Maybe<string>;
  updateExternalSource: (value: string) => void;
  comments: Maybe<string>;
  updateComments: (value: string) => void;
  extraAttributes: any;
  updateExtraResultAttribute: Function;
  resultFiles: Maybe<Array<File>>;
  updateResultFiles: (files: Array<File>) => void;
  history: History;
  appSession: AppSession;
  parentObjectId?: Maybe<string>;
  files?: Maybe<Array<SavedFile | ErrorLoading>>;
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
                onChange={(value: TODO) =>
                  props.updateExtraResultAttribute(attrKey, value)
                }
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
      {props.files && (
        <FormElement id="Files" label={''} labelWidth={2} elementWidth={5}>
          <p className="form-control-static">
            {Array.isArray(props.files) &&
              props.files.map(file => {
                if (isErrorLoading(file)) {
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
      )}
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
