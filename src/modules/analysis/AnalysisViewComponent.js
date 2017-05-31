// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../types/appSession';
import type { FormData } from './types/form';
import type { Store } from './types/store';
import { Table } from 'reactable';
import MetaInformation from '../../components/metainfo';
import Config from '../../config';
import moment from 'moment';

type Params = { analysisId: string };

type Props = {
  form: FormData,
  store: Store,
  appSession: AppSession,
  params: Params,
  goToUrl: (s: string) => void,
  goBack: () => void
};

const AnalysisView = ({ form, store, appSession, params, goToUrl }: Props) => (
  <div>
    <div className="page-header">
      <h1>
        {I18n.t('musit.analysis.viewAnalysis')}
      </h1>
    </div>
    <form className="form-horizontal">
      <MetaInformation
        updatedBy={form.updatedByName.value}
        updatedDate={form.updatedDate.value}
        registeredBy={form.registeredByName.value}
        registeredDate={form.registeredDate.value}
        onClickEdit={() => {
          goToUrl(
            Config.magasin.urls.client.analysis.editAnalysis(
              appSession,
              params.analysisId
            )
          );
        }}
      />
      <hr />
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="type">Type analyse:</label>
        <div className="col-md-10">
          <p className="form-control-static" id="type">
            {getAnalysisTypeTerm(form, store, appSession)}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="reason">
          Formål med analysen:
        </label>
        <div className="col-md-10">
          <p className="form-control-static" id="reason">
            {getAnalysisPurpose(form, store, appSession)}
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
        <label className="control-label col-md-2" htmlFor="status">
          Sted for analysen:
        </label>
        <div className="col-md-5">
          <p className="form-control-static" id="status">
            {getPlaceText(form.place.value)}
          </p>
        </div>
      </div>

      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="caseNumber">Saksnummer:</label>
        <div className="col-md-10">
          <p className="form-control-static" id="caseNumber">
            {form.caseNumbers.value &&
              Array.isArray(form.caseNumbers.value) &&
              form.caseNumbers.value.join(', ')}
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
      { form.persons.value.map((p,i) =>
      <div key={`persons_${i}`} className="form-group">
        <label className="control-label col-md-2" htmlFor="responsible-name1">
          Navn:
        </label>
        <div className="col-md-2">
          <p className="form-control-static" id="responsible-name1">{p.name}</p>
        </div>
        <label className="control-label col-md-1" htmlFor="responsible-role1">
          Rolle:
        </label>
        <div className="col-md-2">
          <p className="form-control-static" id="responsible-role1">{p.role}</p>
        </div>
        <label className="control-label col-md-1" htmlFor="responsible-role1">
        Dato:
      </label>
        <div className="col-md-2">
          <p className="form-control-static" id="responsible-date">{p.date && moment(p.date).format('DD.MM.YYYY')}</p>
        </div>
      </div>)}
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
                  {form.restrictions_requester.value || ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="reason">
                Årsak til klausulering:
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="reason">
                  {form.restrictions_reason.value || ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="caseNumbers">
                Saksnummer:
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="caseNumbers">
                  {form.restrictions_caseNumbers.value &&
                    Array.isArray(form.restrictions_caseNumbers.value)
                    ? form.restrictions_caseNumbers.value.join(', ')
                    : ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="expirationDate">
                Sluttdato:
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="expirationDate">
                  {form.restrictions_expirationDate.value || ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="cancelledReason">
                Årsak til oppheving:
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="cancelledReason">
                  {form.restrictions_cancelledReason.value || ''}
                </p>
              </div>
            </div>
          </div>}
      </div>
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

function getPlaceText(actorId?: ?string): string {
  if (!actorId) {
    return '';
  }
  switch (actorId) {
    case 355:
      return 'Canadian Centre for DNA Barcoding';
    case 356:
      return 'Macrogen Europe';
    case 357:
      return 'Poznan radiocarbon laboratory';
    case 358:
      return 'Beta Analytic Limited';
    case 359:
      return 'Chrono Centre';
    case 360:
      return 'Vitenskapsmuseet: Nasjonallaboratoriene for datering';
    case 361:
      return 'Norwegian geological Survey';
    case 362:
      return 'Museum of Archaeology/UiS';
    default:
      return 'N/A: ' + actorId;
  }
}

function getAnalysisTypeTerm(form, store, appSession) {
  if (form.analysisTypeId.rawValue && store.analysisTypes) {
    const foundType = store.analysisTypes.find(a => a.id === form.analysisTypeId.value);
    if (foundType) {
      return appSession.isEn ? foundType.enName : foundType.noName;
    }
  }
  return '';
}

function getAnalysisPurpose(form, store, appSession) {
  if (form.reason.rawValue && store.purposes) {
    const foundType = store.purposes.find(a => `${a.id}` === form.reason.rawValue);
    if (foundType) {
      return appSession.isEn ? foundType.enPurpose : foundType.noPurpose;
    }
  }
  return '';
}

export default AnalysisView;
