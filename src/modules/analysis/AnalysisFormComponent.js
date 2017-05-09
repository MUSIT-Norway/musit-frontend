/* @flow */
import React from 'react';
import { I18n } from 'react-i18nify';
import { hashHistory } from 'react-router';
import Config from '../../config';
import type { AppSession } from '../../types/appSession';
import type { FormData } from './types/form';
import type { ObjectData } from '../../types/object';
import AddButton from './components/AddButton';
import { Table } from 'reactable';

type Location = { state?: Array<ObjectData> };

type AnalysisType = { id: string, name: string, category: string };
type Analysis = { id: number, analysisTypeId: string, events: Array<ObjectData> }

type Store = {
  analysis?: Analysis,
  analysisTypes?: Array<AnalysisType>,
  analysisTypeCategories?: Array<String>
};

type SaveAnalysisFn = (
  props: { museumId: number, data: mixed, token: string }
) => Promise<*>;

type Props = {
  form: FormData,
  updateForm: Function,
  store: Store,
  appSession: AppSession,
  saveAnalysisEvent: SaveAnalysisFn,
  submitForm: Function,
  location: Location
};

export const updateFormField = (field: string, updateForm: Function) =>
  (e: { target: { value: string } }) =>
    updateForm({
      name: field,
      rawValue: e.target.value
    });

export const updateBooleanField = (b: boolean) =>
  (field: string, updateForm: Function) =>
    () =>
      updateForm({
        name: field,
        rawValue: b
      });

export const getAnalysisTypeTerm = (store: Store) => {
  if (store.analysis && store.analysis.analysisTypeId && store.analysisTypes) {
    const analysisTypeId = store.analysis.analysisTypeId;
    const foundType = store.analysisTypes.find(
      type => type.id.indexOf(`${analysisTypeId}`) === 0
    );
    return foundType ? foundType.name : '';
  }
  return '';
};

const AnalysisForm = (
  { form, updateForm, store, saveAnalysisEvent, submitForm, appSession, location }: Props
) => {
  return (
    <div>
      <div className="page-header">
        <h1>
          {I18n.t('musit.analysis.registeringAnalysis')}
        </h1>
      </div>
      <form className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="type">Type analyse:</label>
          {!form.id.value
            ? <div>
                <div className="col-sm-5">
                  <select
                    id="type"
                    className="form-control"
                    value={form.analysisTypeCategory.value || ''}
                    onChange={updateFormField(form.analysisTypeCategory.name, updateForm)}
                  >
                    <option value="">Velg kategori</option>
                    {store.analysisTypeCategories &&
                      store.analysisTypeCategories.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                  </select>
                </div>
                {form.analysisTypeCategory.rawValue &&
                  <div className="col-sm-5">
                    <select
                      id="subType"
                      className="form-control"
                      value={form.analysisTypeId.rawValue || ''}
                      onChange={updateFormField(form.analysisTypeId.name, updateForm)}
                    >
                      <option value="">Velg type</option>
                      {store.analysisTypes &&
                        store.analysisTypes
                          .filter(
                            b => b.category.toString() === form.analysisTypeCategory.value
                          )
                          .map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>}
              </div>
            : <div className="col-sm-5">
                <p className="form-control-static">
                  {getAnalysisTypeTerm(store)}
                </p>
              </div>}
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="purpose">
            Formål med analysen:
          </label>
          <div className="col-sm-10">
            <select id="purpose" className="form-control">
              <option>Velg formål (ikke implementert på backend)</option>
              <option value="other">...</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="status">
            Status på analysen:
          </label>
          <div className="col-sm-10">
            <div className="btn-group" id="status">
              <select
                id="status"
                className="form-control"
                value={form.status.rawValue || ''}
                onChange={updateFormField(form.status.name, updateForm)}
              >
                <option value="">Velg formål</option>
                <option value="1">1. Under forberedelse</option>
                <option value="2">2. Analyse påbegynt</option>
                <option value="3">3. Analyse ferdig</option>
                <option value="4">4. Avsluttet uten resultat</option>
              </select>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="location">
            Analysested:
          </label>
          <div className="col-sm-10">
            <select id="location" className="form-control">
              <option>Velg sted (ikke implementert på backend)</option>
              <option value="other">...</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="casenumber">
            Saksnummer:
          </label>
          <div className="col-sm-5">
            <input
              type="text"
              className="form-control"
              id="casenumber"
              value={form.caseNumber.rawValue || ''}
              onChange={updateFormField(form.caseNumber.name, updateForm)}
            />
          </div>
          <AddButton id="1" label="Legg til saksnummer" md={5} />
        </div>
        <hr />
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="note">Kommentar:</label>
          <div className="col-sm-10">
            <textarea
              className="form-control"
              rows={5}
              id="note"
              value={form.note.rawValue || ''}
              onChange={updateFormField(form.note.name, updateForm)}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label">Personer tilknyttet analysen:</label>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="responsible-name1">
            Navn:
          </label>
          <div className="col-sm-2">
            <input type="text" className="form-control" id="responsible-name1" />
          </div>
          <label className="control-label col-sm-1" htmlFor="responsible-role1">
            Rolle:
          </label>
          <div className="col-sm-2">
            <select id="responsible-role1" className="form-control">
              <option>Velg rolle</option>
              <option value="other">...</option>
            </select>
          </div>
          <AddButton id="3" label="Legg til person" md={2} />
        </div>
        <hr />
        <div className="well">
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="objects">
              Objekter:
            </label>
            <div className="col-sm-10">
              <Table
                id="objects"
                className="table"
                columns={[
                  { key: 'museumNo', label: 'Museumsnr' },
                  { key: 'subNo', label: 'Unr' },
                  { key: 'term', label: 'Term/artsnavn' }
                ]}
                data={
                  location && location.state
                    ? location.state || []
                    : store.analysis && store.analysis.events
                }
                sortable={['museumNumber', 'subNumber', 'term']}
                noDataText="Ingen objekter"
              />
            </div>
            <AddButton id="2" label="Legg til objekt" md={11} mdOffset={2} />
          </div>
          <hr />
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="externalSource">
              Ekstern kilde:
            </label>
            <div className="col-sm-5">
              <input
                className="form-control"
                id="externalSource"
                value={form.externalSource.rawValue || ''}
                onChange={updateFormField(form.externalSource.name, updateForm)}
              />
            </div>
            <div className="col-sm-2">
              <button className="btn btn-default">Lagre</button>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="file">
              Last opp fil:
            </label>
            <div className="col-sm-5">
              <input className="form-control" id="file" />
            </div>
            <div className="col-sm-2">
              <button className="btn btn-default">Bla gjennom</button>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="resultNote">
              Kommentar til resultat:
            </label>
            <div className="col-sm-10">
              <textarea
                className="form-control"
                rows={5}
                id="resultNote"
                value={form.comments.rawValue || ''}
                onChange={updateFormField(form.comments.name, updateForm)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="isRestricted">
              Klausulering:
            </label>
            <div className="col-sm-10">
              <div className="btn-group" data-toggle="buttons">
                <label
                  className={`btn btn-default ${form.restrictions.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="options"
                    onChange={updateBooleanField(true)(
                      form.restrictions.name,
                      updateForm
                    )}
                  />
                  {' '}
                  Ja
                </label>
                <label
                  className={
                    `btn btn-default ${!form.restrictions.value ? 'active' : ''}`
                  }
                >
                  <input
                    type="radio"
                    name="options"
                    onChange={updateBooleanField(false)(
                      form.restrictions.name,
                      updateForm
                    )}
                  />
                  {' '}
                  Nei
                </label>
              </div>
            </div>
          </div>
          {form.restrictions.value &&
            <div>
              <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="restrictedBy">
                  Klausulert for:
                </label>
                <div className="col-sm-10">
                  <input
                    className="form-control"
                    id="restrictedBy"
                    placeholder="Fornavn Etternavn"
                    value={form.requester.rawValue || ''}
                    onChange={updateFormField(form.requester.name, updateForm)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="restrictionCause">
                  Årsak til klausulering:
                </label>
                <div className="col-sm-10">
                  <input
                    className="form-control"
                    id="restrictionCause"
                    value={form.reason.rawValue || ''}
                    onChange={updateFormField(form.reason.name, updateForm)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="control-label col-sm-2"
                  htmlFor="restrictionCaseNumbers"
                >
                  Saksnummer:
                </label>
                <div className="col-sm-5">
                  <input
                    className="form-control"
                    id="restrictionCaseNumbers"
                    value={form.caseNumbers.rawValue || ''}
                    onChange={updateFormField(form.caseNumbers.name, updateForm)}
                  />
                </div>
                <AddButton id="3" label="Legg til flere saksnummer" md={2} />
              </div>
              <div className="form-group">
                <label
                  className="control-label col-sm-2"
                  htmlFor="restrictionExpirationEndDate"
                >
                  Sluttdato:
                </label>
                <div className="col-sm-5">
                  <input
                    className="form-control"
                    id="restrictionExpirationEndDate"
                    value={form.expirationDate.rawValue || ''}
                    onChange={updateFormField(form.expirationDate.name, updateForm)}
                  />
                </div>
              </div>
            </div>}
        </div>
        <hr />
        <button
          className="btn btn-primary"
          onClick={submitForm(appSession, form, location, saveAnalysisEvent)}
        >
          Lagre
        </button>
        {' '}
        <button className="btn btn-default">
          Avbryt
        </button>
      </form>
    </div>
  );
};

AnalysisForm.defaultProps = {
  submitForm: (
    appSession: AppSession,
    form: FormData,
    location?: Location,
    saveAnalysisEvent: SaveAnalysisFn,
    goTo: Function = hashHistory.push
  ) =>
    (e: Event) => {
      e.preventDefault();
      const restriction = form.restrictions.value
        ? {
            requester: form.requester.value,
            expirationDate: form.expirationDate.value,
            reason: form.reason.value,
            caseNumbers: null, //form.caseNumbers.value,
            cancelledReason: null //form.reason.value
          }
        : null;

      const data = {
        analysisTypeId: form.analysisTypeId.value,
        doneBy: null,
        doneDate: null,
        note: form.note.value,
        responsible: form.responsible.value,
        administrator: null,
        completedBy: null,
        completedDate: null,
        restriction: restriction,
        objectIds: location && location.state ? location.state.map(a => a.uuid) : [],
        caseNumbers: form.caseNumber.value ? [form.caseNumber.value] : null,
        status: form.status.value,
        reason: null,
        type: 'AnalysisCollection'
      };

      return saveAnalysisEvent({
        id: form.id.value,
        museumId: appSession.museumId,
        data: data,
        token: appSession.accessToken
      }).then((analysis: number | Analysis) => {
        goTo(Config.magasin.urls.client.analysis.viewAnalysis(appSession, (typeof analysis === 'number') ? analysis : analysis.id));
      });
    }
};

export default AnalysisForm;
