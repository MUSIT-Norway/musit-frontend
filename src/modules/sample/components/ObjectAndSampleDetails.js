// @flow
import React from 'react';
import NavigateToObject from '../../../components/navigations/NavigateToObject';
import MusitI18n from '../../../components/MusitI18n';
import { I18n } from 'react-i18nify';
import type { SampleDateExtended } from '../sampleStore';
import type { ObjectOrSample } from '../types';
import type { AppSession } from '../../../types/appSession';
import type { History } from '../../../types/Routes';

export type Props = {
  objectData: ObjectOrSample,
  parentSample: ?SampleDateExtended,
  history: History,
  appSession: AppSession
};

export default function ObjectAndSampleDetails(props: Props) {
  const parentSample = props.parentSample;
  const objectData = props.objectData;
  return (
    <div>
      <span style={{ marginRight: 20 }}>
        <strong>{I18n.t('musit.analysis.museumNumber')}</strong>
        {' '}
        {objectData.museumNo}
      </span>
      <span style={{ marginRight: 20 }}>
        <strong>{I18n.t('musit.analysis.underNumber')}</strong>
        {' '}
        {objectData.subNo}
      </span>
      <span>
        <strong>{I18n.t('musit.analysis.term')}</strong>
        {' '}
        {objectData.term}
      </span>
      <NavigateToObject
        objectId={objectData.uuid}
        appSession={props.appSession}
        history={props.history}
      />
      {parentSample &&
        parentSample.sampleNum &&
        <span>
          <br />
          <span style={{ marginRight: 20 }}>
            <strong>{I18n.t('musit.sample.sampleNumber')}</strong>
            {' '}
            {parentSample.sampleNum}
          </span>
          <span style={{ marginRight: 20 }}>
            <strong>{I18n.t('musit.sample.sampleType')}</strong>
            {' '}
            {parentSample.sampleType &&
              <MusitI18n
                en={parentSample.sampleType.enSampleType}
                no={parentSample.sampleType.noSampleType}
              />}
          </span>
          <span style={{ marginRight: 20 }}>
            <strong>{I18n.t('musit.sample.sampleSubType')}</strong>
            {' '}
            {parentSample.sampleType &&
              <MusitI18n
                en={parentSample.sampleType.enSampleSubType}
                no={parentSample.sampleType.noSampleSubType}
              />}
          </span>
        </span>}
    </div>
  );
}
