import React from 'react';
import Config from '../../config';
import { hashHistory } from 'react-router';

export default function SampleViewComponent(props) {
  const objectData = props.location.state[0];
  const form = props.form;
  return (
    <form className="form-horizontal">
      <div className="page-header">
        <h1>
          Prøveuttak
        </h1>
      </div>
      <h4>
        Avledet fra objekt
      </h4>
      <div className="form-group">
        <span className="col-md-2">
          <strong>MusNo:</strong> {objectData.museumNo}
        </span>
        <span className="col-md-2">
          <strong>Unr:</strong> {objectData.subNo}
        </span>
        <span className="col-md-2">
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
              <div className="col-md-2">{p.date}</div>
            </div>
          ))}
      </div>
      <hr />
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
        <div className="col-md-2">
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
      <div className="form-group">
        <label className="control-label col-md-2">Prøvetype:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.sampleType.value}
          </p>
        </div>
        <label className="control-label col-md-2">Prøveundertype:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.subTypeValue.value}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">Beskrivelse av prøve:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.description.value}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">Status:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.status.value}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2">Målvolum/-vekt:</label>
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
        <label className="control-label col-md-2">Beskrivelse:</label>
        <div className="col-md-2">
          <p className="form-control-static">
            {form.note.value}
          </p>
        </div>
      </div>
      <hr />
      <button
        className="btn btn-primary"
        onClick={e => {
          e.preventDefault();
          hashHistory.push({
            pathname: Config.magasin.urls.client.analysis.editSample(
              props.appSession,
              props.params.sampleId
            ),
            state: [objectData]
          });
        }}
      >
        Endre
      </button>
      <a style={{ marginLeft: 20 }} onClick={e => e.preventDefault()}>
        Avbryt
      </a>
    </form>
  );
}
