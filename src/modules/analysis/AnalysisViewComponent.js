/* @flow */
import React from 'react';
import { I18n } from 'react-i18nify';
import { SaveCancel } from '../../components/formfields/index';
import { hashHistory } from 'react-router';
import Config from '../../config';
import type { AppSession } from '../../types/appSession';
import type { FormData } from './types/form';
import type { Store } from './types/store';
import { Table } from 'reactable';
import MetaInformation from './components/MetaInformation';

type Params = { analysisId: string };

type Props = { form: FormData, store: Store, appSession: AppSession, params: Params };

const AnalysisView = ({ form, store, appSession, params }: Props) => (
  <div>
    <div className="page-header">
      <h1>
        {I18n.t('musit.analysis.viewAnalysis')}
      </h1>
    </div>
    <form className="form-horizontal">
      <MetaInformation form={form} />
      <hr />
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="type">Type analyse:</label>
        <div className="col-md-10">
          <p className="form-control-static" id="type">
            {getAnalysisTypeTerm(form, store)}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="status">
          Status på analysen:
        </label>
        <div className="col-md-5">
          <p className="form-control-static" id="status">
            {getStatusText(form.status.value)}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="caseNumber">Saksnummer:</label>
        <div className="col-md-10">
          <p className="form-control-static" id="caseNumber">
            {form.caseNumber.value}
          </p>
        </div>
      </div>
      <hr />
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="note">
          Beskrivelse/ kommentar:
        </label>
        <div className="col-md-10">
          <p className="form-control-static" id="note">
            {form.note.value}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label">Personer tilknyttet analysen:</label>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="responsible-name1">
          Navn:
        </label>
        <div className="col-md-2">
          <p className="form-control-static" id="responsible-name1">n/a</p>
        </div>
        <label className="control-label col-md-1" htmlFor="responsible-role1">
          Rolle:
        </label>
        <div className="col-md-2">
          <p className="form-control-static" id="responsible-role1">n/a</p>
        </div>
      </div>
      <hr />
      <div className="well">
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="objects">
            Objekter:
          </label>
          <div className="col-md-10">
            <Table
              id="objects"
              className="table"
              columns={[
                { key: 'museumNo', label: 'Museumsnr' },
                { key: 'subNo', label: 'Unr' },
                { key: 'term', label: 'Term/artsnavn' }
              ]}
              data={
                form.type.value === 'AnalysisCollection'
                  ? form.events.value
                  : [
                      {
                        term: form.term.value,
                        museumNo: form.museumNo.value,
                        subNo: form.subNo.value
                      }
                    ]
              }
              sortable={['museumNumber', 'subNumber', 'term']}
              noDataText="Ingen objekter"
            />
          </div>
        </div>
        <hr />
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="externalSource">
            Ekstern kilde:
          </label>
          <div className="col-md-10">
            <p className="form-control-static" id="externalSource">
              {form.externalSource.value}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="externalFile">
            Vedlegg:
          </label>
          <div className="col-md-10">
            <p className="form-control-static" id="externalFile">{' '}</p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="comments">
            Kommentar til resultat:
          </label>
          <div className="col-md-10">
            <p className="form-control-static" id="comments">
              {form.comments.value}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="restrictions">
            Klausulering:
          </label>
          <div className="col-md-10">
            <p className="form-control-static" id="restrictions">
              {form.restrictions.value ? 'Ja' : 'Nei'}
            </p>
          </div>
        </div>
        {form.restrictions.rawValue &&
          <div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="requester">
                Klausulert for:
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="requester">
                  {form.note.value || ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="reason">
                Årsak til klausulering:
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="reason">
                  {form.reason.value || ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="caseNumbers">
                Saksnummer:
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="caseNumbers">
                  {form.caseNumbers.value || ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="expirationDate">
                Sluttdato:
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="expirationDate">
                  {form.expirationDate.value || ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="cancelledBy">
                Opphevet av:
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="cancelledBy">
                  {form.cancelledBy.value || ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="cancelledReason">
                Årsak til oppheving:
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="cancelledReason">
                  {form.cancelledReason.value || ''}
                </p>
              </div>
            </div>
          </div>}
      </div>
      <hr />
      <SaveCancel
        onClickSave={e => {
          e.preventDefault();
          hashHistory.push(
            Config.magasin.urls.client.analysis.editAnalysis(
              appSession,
              params.analysisId
            )
          );
        }}
        saveLabel="Endre"
      />
    </form>
  </div>
);

function getStatusText(status?: ?number): string {
  if (!status) {
    return '';
  }
  switch (status) {
    case 1:
      return '1. Under forberedelse';
    case 2:
      return '2. Analyse påbegynt';
    case 3:
      return '3. Analyse ferdig';
    case 4:
      return '4. Avsluttet uten resultat';
    default:
      return 'N/A: ' + status;
  }
}

function getAnalysisTypeTerm(form, store) {
  if (form.analysisTypeId.rawValue && store.analysisTypes) {
    const foundType = store.analysisTypes.find(
      a => a.id === form.analysisTypeId.rawValue
    );
    return foundType ? foundType.name : '';
  }
}

export default AnalysisView;
