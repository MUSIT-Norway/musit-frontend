// @flow
import React from 'react';
import { hashHistory } from 'react-router';
import MetaInformation from '../../components/metainfo';
import Sample from '../../models/sample';
import type { SampleData } from '../../types/samples';
import moment from 'moment';
import type { AppSession } from '../../types/appSession';
import type { FormDetails } from './types/form';
import type { ObjectData } from '../../types/object';
import ReadOnlySampleType from './components/ReadOnlySampleType';

type Props = {
  form: FormDetails,
  appSession: AppSession,
  location: { state: Array<ObjectData> },
  params: { sampleId: string },
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
    object: mixed
  ) => (e: { preventDefault: Function }) => void
};

export default function SampleViewComponent({
  form,
  store,
  appSession,
  location: { state },
  params: { sampleId },
  clickCreateAnalysis,
  clickEditSample
}: Props & ClickEvents) {
  const objectData = state[0];
  return (
    <form className="form-horizontal">
      <div className="page-header">
        <h1>
          Prøve
        </h1>
      </div>
      <div className="pull-right">
        <button
          className="btn-info"
          onClick={clickCreateAnalysis(appSession, { ...objectData, ...store.sample })}
        >
          Opprett analyse
        </button>
        <button
          className="btn-info"
          onClick={clickEditSample(appSession, sampleId, objectData)}
        >
          Endre prøve
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
        Avledet fra objekt
      </h4>
      <div>
        <span style={{ marginRight: 20 }}>
          <strong>Museumnr:</strong> {objectData.museumNo}
        </span>
        <span style={{ marginRight: 20 }}>
          <strong>Unr:</strong> {objectData.subNo}
        </span>
        <span>
          <strong>Term/artsnavn:</strong> {objectData.term}
        </span>
      </div>
      <hr />
      <h4>Personer tilknyttet prøveuttaket</h4>
      <div>
        <div className="row">
          <div className="col-md-4"><strong>Navn</strong></div>
          <div className="col-md-2"><strong>Rolle</strong></div>
          <div className="col-md-2"><strong>Dato</strong></div>
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
        <label className="control-label col-md-2">Prøvenr:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.sampleNum.value}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">PrøveID:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.sampleId.value}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">EksternID:</label>
        <div className="col-md-3">
          <p className="form-control-static">
            {form.externalId.value}
          </p>
        </div>
        <label className="control-label col-md-2">Kilde for ekstern ID:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.externalIdSource.value}
          </p>
        </div>
      </div>
      <ReadOnlySampleType sampleType={form.sampleType} subTypeValue={form.subTypeValue} />
      <div className="form-group">
        <label className="control-label col-md-2">Beskrivelse av prøve:</label>
        <div className="col-md-8">
          <p className="form-control-static">
            {form.description.value}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">Status:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {getStatusValue(form.status.value)}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">Prøvevolum/-vekt:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.size.value}{' '}{form.sizeUnit.value}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">Lagringskontainer:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.container.value}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">Lagringsmedium:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.storageMedium.value}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">Behandling:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.treatment.value}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">Har restmateriale:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {(form.leftoverSample.value === 3 && 'Ja') ||
              (form.leftoverSample.value === 2 && 'Nei') ||
              ''}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">Kommentar:</label>
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
          hashHistory.goBack();
        }}
      >
        Avbryt
      </button>
    </form>
  );
}

function getStatusValue(v) {
  if (v) {
    const statuses = Sample.sampleStatuses;
    const s = statuses.find(e => e.id === v);
    return s && s.noStatus;
  }
}
