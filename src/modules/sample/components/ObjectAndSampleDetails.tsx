// @flow
import React from 'react';
import NavigateToObject from '../../../components/navigations/NavigateToObject';
import MusitI18n from '../../../components/MusitI18n';
import { I18n } from 'react-i18nify';
import type { SampleDataExtended } from '../../../types/samples';
import type { ObjectOrSample } from '../types';
import type { AppSession } from '../../../types/appSession';
import type { History } from '../../../types/Routes';

export type Props = {
  objectData: ObjectOrSample & { derivedFrom: ?SampleDataExtended },
  history: History,
  appSession: AppSession
};

export default function ObjectAndSampleDetails(props: Props) {
  const objectData = props.objectData;
  const derivedFrom = objectData.derivedFrom;
  return (
    <div>
      <span style={{ marginRight: 20 }}>
        <strong>{I18n.t('musit.analysis.museumNumber')}</strong> {objectData.museumNo}
      </span>
      <span style={{ marginRight: 20 }}>
        <strong>{I18n.t('musit.analysis.underNumber')}</strong> {objectData.subNo}
      </span>
      <span>
        <strong>{I18n.t('musit.analysis.term')}</strong> {objectData.term}
      </span>
      <NavigateToObject
        objectId={objectData.uuid}
        appSession={props.appSession}
        history={props.history}
      />
      {!!(derivedFrom && derivedFrom.sampleNum) && (
        <span>
          <br />
          <span style={{ marginRight: 20 }}>
            <strong>{I18n.t('musit.sample.sampleNumber')}</strong> {derivedFrom.sampleNum}
          </span>
          <span style={{ marginRight: 20 }}>
            <strong>{I18n.t('musit.sample.sampleType')}</strong>{' '}
            {derivedFrom.sampleType && (
              <MusitI18n
                en={derivedFrom.sampleType.enSampleType}
                no={derivedFrom.sampleType.noSampleType}
              />
            )}
          </span>
          <span style={{ marginRight: 20 }}>
            <strong>{I18n.t('musit.sample.sampleSubType')}</strong>{' '}
            {derivedFrom.sampleType && (
              <MusitI18n
                en={derivedFrom.sampleType.enSampleSubType}
                no={derivedFrom.sampleType.noSampleSubType}
              />
            )}
          </span>
        </span>
      )}
    </div>
  );
}
