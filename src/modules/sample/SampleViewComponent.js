// @flow
import React from 'react';
import MetaInformation from '../../components/metainfo';
import type { SampleData } from '../../types/samples';
import moment from 'moment';
import type { AppSession } from '../../types/appSession';
import type { FormDetails } from './types/form';
import type { ObjectData } from '../../types/object';
import ReadOnlySampleType from './components/ReadOnlySampleType';
import { I18n } from 'react-i18nify';

type Props = {
  form: FormDetails,
  appSession: AppSession,
  objectData: ObjectData & SampleData,
  sampleStore: { sample: SampleData },
  objectStore: { objectData: ObjectData }
};

type ClickEventReturn = (e: { preventDefault: Function }) => void;

export type SampleProps = {
  statusText: ?string,
  sampleSubType: ?string,
  sampleType: ?string,
  persons: Array<any>,
  clickEditSample: (
    appSession: AppSession,
    sampleId: string,
    object: ObjectData
  ) => ClickEventReturn,
  clickCreateAnalysis: (
    appSession: AppSession,
    sample: SampleData,
    form: FormDetails,
    object: mixed
  ) => ClickEventReturn,
  clickCreateSample: (
    appSession: AppSession,
    sample: SampleData,
    form: FormDetails,
    object: mixed
  ) => ClickEventReturn,
  goBack: () => void
};

export default function SampleViewComponent(props: Props & SampleProps) {
  const mainProps: Props = (props: any);
  const customProps: SampleProps = (props: any);
  const sample = mainProps.sampleStore.sample;
  const objectData = mainProps.objectStore.objectData;
  if (!sample || !objectData) {
    return <div className="loading" />;
  }
  const derivedFrom: any = sample.parentObject.sampleOrObjectData || {};
  return (
    <div className="container">
      <form className="form-horizontal">
        <div className="page-header">
          <h1>
            {I18n.t('musit.sample.sample')}
          </h1>
        </div>
        <div className="pull-right">
          <button className="btn btn-default" onClick={customProps.clickCreateAnalysis}>
            {I18n.t('musit.analysis.createAnalysis')}
          </button>
          <button className="btn btn-default" onClick={customProps.clickEditSample}>
            {I18n.t('musit.sample.updateSample')}
          </button>
          <button className="btn btn-default" onClick={customProps.clickCreateSample}>
            {` ${I18n.t('musit.analysis.createSample')}`}
          </button>
        </div>
        <div>
          <MetaInformation
            updatedBy={sample.updatedStamp ? sample.updatedStamp.name : null}
            updatedDate={sample.updatedStamp ? sample.updatedStamp.date : null}
            registeredBy={sample.registeredStamp.name}
            registeredDate={sample.registeredStamp.date}
          />
          <hr />
        </div>
        <h4>
          {derivedFrom.sampleNum
            ? I18n.t('musit.sample.derivedFromObjectAndSample')
            : I18n.t('musit.sample.derivedFromObject')}

        </h4>
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
          {derivedFrom.sampleNum &&
            <span>
              <br />
              <span style={{ marginRight: 20 }}>
                <strong>{I18n.t('musit.sample.sampleNumber')}</strong>
                {' '}
                {derivedFrom.sampleNum}
              </span>

              <span style={{ marginRight: 20 }}>
                <strong>{I18n.t('musit.sample.sampleType')}</strong>
                {' '}
                {derivedFrom.sampleTypeId}
              </span>
              <span style={{ marginRight: 20 }}>
                <strong>{I18n.t('musit.sample.sampleSubType')}</strong>
                {' '}
                {derivedFrom.sampleTypeId}
              </span>
            </span>}
        </div>
        <hr />
        <h4>{I18n.t('musit.sample.personsAssociatedWithSampleTaking')}</h4>
        <div>
          <div className="row">
            <div className="col-md-4"><strong>{I18n.t('musit.texts.name')}</strong></div>
            <div className="col-md-2"><strong>{I18n.t('musit.texts.role')}</strong></div>
            <div className="col-md-2"><strong>{I18n.t('musit.texts.date')}</strong></div>
          </div>
          {customProps.persons &&
            customProps.persons.map((p, i) => (
              <div className="row" key={i}>
                <div className="col-md-4">{p.name}</div>
                <div className="col-md-2">
                  {I18n.t(`musit.sample.roles.${p.role}`) || p.role}
                </div>
                <div className="col-md-2">
                  {p.date ? moment(p.date).format('DD.MM.YYYY') : null}
                </div>
              </div>
            ))}
        </div>
        <hr />
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.sampleNumber')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {sample.sampleNum}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.sampleId')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {sample.sampleId}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.externalId')}
          </label>
          <div className="col-md-3">
            <p className="form-control-static">
              {sample.externalId && sample.externalId.value}
            </p>
          </div>
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.externalIdSource')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {sample.externalId ? sample.externalId.value : ''}
            </p>
          </div>
        </div>
        <ReadOnlySampleType
          sampleType={customProps.sampleType}
          subTypeValue={customProps.sampleSubType}
        />
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.description')}
          </label>
          <div className="col-md-8">
            <p className="form-control-static">
              {sample.description}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.status')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {customProps.statusText}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.volumeOrWeight')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {sample.size && sample.size.value + ' ' + sample.size.unit}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.storageContainer')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {sample.container}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.storageMedium')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {sample.storageMedium}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.treatment')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {sample.treatment}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.hasResidualMaterial')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {(sample.leftoverSample === 3 && 'Ja') ||
                (sample.leftoverSample === 2 && 'Nei') ||
                ''}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.comments')}
          </label>
          <div className="col-md-8">
            <p className="form-control-static">
              {sample.note}
            </p>
          </div>
        </div>
        <hr />
        <button
          className="btn-link"
          style={{ marginLeft: 20 }}
          onClick={customProps.goBack}
        >
          {I18n.t('musit.texts.cancel')}
        </button>
      </form>
    </div>
  );
}
