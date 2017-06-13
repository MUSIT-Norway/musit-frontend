// @flow
import React from 'react';
import MetaInformation from '../../components/metainfo';
import Sample from '../../models/sample';
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
  location: { state: Array<ObjectData> },
  match: { params: { sampleId: string } },
  store: { sample: SampleData }
};

export type ClickEvents = {
  clickEditSample: (
    appSession: AppSession,
    sampleId: string,
    object: ObjectData
  ) => (e: { preventDefault: Function }) => void,
  clickCreateAnalysis: (
    appSession: AppSession,
    sample: SampleData,
    form: FormDetails,
    object: mixed
  ) => (e: { preventDefault: Function }) => void,
  goBack: () => void
};

export default function SampleViewComponent({
  form,
  store,
  appSession,
  location: { state },
  match: { params: { sampleId } },
  clickCreateAnalysis,
  clickEditSample,
  goBack
}: Props & ClickEvents) {
  const objectData = state[0];
  return (
    <div className="container">
      <form className="form-horizontal">
        <div className="page-header">
          <h1>
            {I18n.t('musit.sample.sample')}
          </h1>
        </div>
        <div className="pull-right">
          <button
            className="btn btn-default"
            onClick={clickCreateAnalysis(appSession, store.sample, form, objectData)}
          >
            {I18n.t('musit.analysis.createAnalysis')}
          </button>
          <button
            className="btn btn-default"
            onClick={clickEditSample(appSession, sampleId, objectData)}
          >
            {I18n.t('musit.sample.updateSample')}
          </button>
        </div>
        <div>
          <MetaInformation
            updatedBy={form.updatedByName.value}
            updatedDate={form.updatedDate.value}
            registeredBy={form.registeredByName.value}
            registeredDate={form.registeredDate.value}
          />
          <hr />
        </div>
        <h4>
          {I18n.t('musit.sample.derivedFromObject')}
        </h4>
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
        </div>
        <hr />
        <h4>{I18n.t('musit.sample.personsAssociatedWithSampleTaking')}</h4>
        <div>
          <div className="row">
            <div className="col-md-4"><strong>{I18n.t('musit.texts.name')}</strong></div>
            <div className="col-md-2"><strong>{I18n.t('musit.texts.role')}</strong></div>
            <div className="col-md-2"><strong>{I18n.t('musit.texts.date')}</strong></div>
          </div>
          {form.persons.value &&
            form.persons.value.map((p, i) => (
              <div className="row" key={i}>
                <div className="col-md-4">{p.name}</div>
                <div className="col-md-2">{p.role}</div>
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
              {form.sampleNum.value}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.sampleId')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {form.sampleId.value}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.externalId')}
          </label>
          <div className="col-md-3">
            <p className="form-control-static">
              {form.externalId.value}
            </p>
          </div>
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.externalIdSource')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {form.externalIdSource.value}
            </p>
          </div>
        </div>
        <ReadOnlySampleType
          sampleType={form.sampleType}
          subTypeValue={form.sampleSubType}
        />
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.description')}
          </label>
          <div className="col-md-8">
            <p className="form-control-static">
              {form.description.value}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.status')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {getStatusValue(form.status.value)}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.volumeOrWeight')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {form.size.value}{' '}{form.sizeUnit.value}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.storageContainer')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {form.container.value}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.storageMedium')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {form.storageMedium.value}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.treatment')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {form.treatment.value}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.hasResidualMaterial')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {(form.leftoverSample.value === 3 && 'Ja') ||
                (form.leftoverSample.value === 2 && 'Nei') ||
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
              {form.note.value}
            </p>
          </div>
        </div>
        <hr />
        <button
          className="btn-link"
          style={{ marginLeft: 20 }}
          onClick={e => {
            e.preventDefault();
            goBack();
          }}
        >
          {I18n.t('musit.texts.cancel')}
        </button>
      </form>
    </div>
  );
}

function getStatusValue(v) {
  if (v) {
    const statuses = Sample.sampleStatuses;
    const s = statuses.find(e => e.id === v);
    return s && s.noStatus;
  }
}
