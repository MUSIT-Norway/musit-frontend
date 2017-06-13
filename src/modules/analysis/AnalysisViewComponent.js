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
import ObjectTable from '../objects/components/ObjectTable';
import AddButton from '../../components/AddButton';

type Match = { params: { analysisId: string } };

type Predefined = {
  analysisTypes: Array<any>,
  purposes: Array<any>,
  analysisLabList: Array<any>,
  categories: mixed
};

type Props = {
  form: FormData,
  store: Store,
  appSession: AppSession,
  predefined: Predefined,
  match: Match,
  goToUrl: (s: string) => void,
  goBack: () => void
};

const AnalysisView = ({ form, store, predefined, appSession, match, goToUrl }: Props) => (
  <div className="container">
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
              match.params.analysisId
            )
          );
        }}
      />
      <hr />
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="type">Type analyse:</label>
        <div className="col-md-10">
          <p className="form-control-static" id="type">
            {getAnalysisTypeTerm(form, predefined, appSession)}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="reason">
          Formål med analysen:
        </label>
        <div className="col-md-10">
          <p className="form-control-static" id="reason">
            {getAnalysisPurpose(form, predefined, appSession)}
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
            {getLabPlaceText(predefined, form.orgId.value)}
          </p>
        </div>
      </div>

      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="caseNumber">
          Saksnummer:
        </label>
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
      {form.persons.value &&
        form.persons.value.map((p, i) => (
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
              <p className="form-control-static" id="responsible-date">
                {p.date && moment(p.date).format('DD.MM.YYYY')}
              </p>
            </div>
          </div>
        ))}
      <hr />
      <div className="well">
        <div className="form-group">
          <label className="col-md-12" htmlFor="objects">
            Objekter/prøver:
          </label>
        </div>
        <div className="form-group">
          <div className="col-md-12 col-md-offset-0">
            <ObjectTable
              objects={
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
            />
          </div>
          <div className="col-md-11 col-md-offset-0">
            <AddButton label="Legg til object" />
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
                  {form.restrictions_requesterName.value || ''}
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

function getLabPlaceText(predefined: any, actorId?: ?string): string {
  if (!actorId) {
    return '';
  }
  return predefined.analysisLabList.find(x => x.id === actorId).fullName;
}

function getAnalysisTypeTerm(form, predefined: Predefined, appSession) {
  if (form.analysisTypeId.rawValue && predefined.analysisTypes) {
    const foundType = predefined.analysisTypes.find(
      a => a.id === form.analysisTypeId.value
    );
    if (foundType) {
      return appSession.isEn ? foundType.enName : foundType.noName;
    }
  }
  return '';
}

function getAnalysisPurpose(form, predefined, appSession) {
  if (form.reason.rawValue && predefined.purposes) {
    const foundType = predefined.purposes.find(a => `${a.id}` === form.reason.rawValue);
    if (foundType) {
      return appSession.isEn ? foundType.enPurpose : foundType.noPurpose;
    }
  }
  return '';
}

export default AnalysisView;
