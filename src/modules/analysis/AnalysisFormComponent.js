// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import Config from '../../config';
import type { AppSession } from 'types/appSession';
import type { ObjectData } from 'types/object';
import type { FormData } from './types/form';
import type { Store } from './types/store';
import PersonRoleDate from '../../components/samples/personRoleDate';
import AddButton from '../../components/AddButton';
import { Table } from 'reactable';
import MetaInformation from '../../components/metainfo';

type Location = { state?: Array<ObjectData> };

type SaveAnalysisFn = (props: {
  museumId: number,
  data: mixed,
  token: string
}) => Promise<*>;

type Props = {
  form: FormData,
  updateForm: Function,
  store: Store,
  appSession: AppSession,
  saveAnalysis: SaveAnalysisFn,
  saveResult: Function,
  location: Location,
  goToUrl: (s: string) => void,
  goBack: () => void
};

const analysisPlaces = [
  {
    orgId: 355,
    fullName: 'Canadian Centre for DNA Barcoding'
  },
  {
    orgId: 356,
    fullName: 'Macrogen Europe'
  },
  {
    orgId: 357,
    fullName: 'Poznan radiocarbon laboratory'
  },
  {
    orgId: 358,
    fullName: 'Beta Analytic Limited'
  },
  {
    orgId: 359,
    fullName: 'Chrono Centre'
  },
  {
    orgId: 360,
    fullName: 'Vitenskapsmuseet: Nasjonallaboratoriene for datering'
  },
  {
    orgId: 361,
    fullName: 'Norwegian geological Survey'
  },
  {
    orgId: 362,
    fullName: 'Museum of Archaeology/UiS'
  }
];

const AnalysisForm = ({
  form,
  updateForm,
  store,
  saveAnalysis,
  saveResult,
  appSession,
  location,
  goToUrl,
  goBack
}: Props) => {
  return (
    <div>
      <div className="page-header">
        <h1>
          {form.id.value
            ? I18n.t('musit.analysis.editAnalysis')
            : I18n.t('musit.analysis.registeringAnalysis')}
        </h1>
      </div>
      <form className="form-horizontal">
        {form.id.value &&
          <div>
            <MetaInformation
              updatedBy={form.updatedByName.value}
              updatedDate={form.updatedDate.value}
              registeredBy={form.registeredByName.value}
              registeredDate={form.registeredDate.value}
            />
            <hr />
          </div>}
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="type">Type analyse:</label>
          {!form.id.value
            ? <div>
                <div className="col-md-5">
                  <select
                    id="type"
                    className="form-control"
                    value={form.analysisTypeCategory.value || ''}
                    onChange={updateFormField(form.analysisTypeCategory.name, updateForm)}
                  >
                    <option value="">Velg kategori</option>
                    {store.categories &&
                      Object.keys(store.categories).map(k => (
                        <option key={k} value={k}>{store.categories[k]}</option>
                      ))}
                  </select>
                </div>
                {form.analysisTypeCategory.rawValue &&
                  form.analysisTypeCategory.rawValue !== '0' &&
                  <div className="col-md-5">
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
                          .map(a => (
                            <option key={a.id} value={a.id}>
                              {appSession.language.isEn ? a.enName : a.noName}
                            </option>
                          ))}
                    </select>
                  </div>}
              </div>
            : <div className="col-md-5">
                <p className="form-control-static">
                  {getAnalysisTypeTerm(store, appSession)}
                </p>
              </div>}
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="reason">
            Formål med analysen:
          </label>
          <div className="col-md-10">
            <select
              id="reason"
              className="form-control"
              value={form.reason.rawValue || ''}
              onChange={updateFormField(form.reason.name, updateForm)}
            >
              <option value="">Velg formål</option>
              {store.purposes &&
                store.purposes.map(a => (
                  <option key={a.id} value={a.id}>
                    {appSession.isEn ? a.enPurpose : a.noPurpose}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="status">
            Status på analysen:
          </label>
          <div className="col-md-10">
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

        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="place">
            Sted for analysen:
          </label>
          <div className="col-md-10">
            <select
              id="place"
              className="form-control"
              value={form.place.rawValue || ''}
              onChange={updateFormField(form.place.name, updateForm)}
            >
              <option value="">Velg analysested</option>
              {analysisPlaces.map(a => (
                <option key={a.orgId} value={a.orgId}>
                  {a.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="casenumber">
            Saksnummer:
          </label>
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              id="casenumber"
              value={
                (Array.isArray(form.caseNumbers.rawValue) &&
                  form.caseNumbers.rawValue.join(', ')) ||
                  ''
              }
              onChange={updateArrayField(form.caseNumbers.name, updateForm)}
            />
          </div>
        </div>
        <hr />
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="note">Kommentar:</label>
          <div className="col-md-10">
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
        <PersonRoleDate
          appSession={appSession}
          personData={form.persons.value}
          updateForm={updateForm}
          fieldName={form.persons.name}
          roles={['responsible', 'doneBy']}
          showDateForRole={(roleName: string) => roleName !== 'responsible'}
        />
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
                  location && location.state
                    ? location.state || []
                    : store.analysis && store.analysis.events
                }
                sortable={['museumNumber', 'subNumber', 'term']}
                noDataText="Ingen objekter"
              />
            </div>
            <div className="col-md-11 col-md-offset-2">
              <AddButton label="Legg til object" />
            </div>
          </div>
          <hr />
          <div className="form-group">
            <label className="control-label col-md-2" htmlFor="externalSource">
              Ekstern kilde:
            </label>
            <div className="col-md-5">
              <input
                className="form-control"
                id="externalSource"
                value={form.externalSource.rawValue || ''}
                onChange={updateFormField(form.externalSource.name, updateForm)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-default">Lagre</button>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-md-2" htmlFor="file">
              Last opp fil:
            </label>
            <div className="col-md-5">
              <input className="form-control" id="file" />
            </div>
            <div className="col-md-2">
              <button className="btn btn-default">Bla gjennom</button>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-md-2" htmlFor="resultNote">
              Kommentar til resultat:
            </label>
            <div className="col-md-10">
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
            <label className="control-label col-md-2" htmlFor="isRestricted">
              Klausulering:
            </label>
            <div className="col-md-10">
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
                  className={`btn btn-default ${!form.restrictions.value ? 'active' : ''}`}
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
                <label className="control-label col-md-2" htmlFor="restrictedBy">
                  Klausulert for:
                </label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    id="restrictedBy"
                    placeholder="Fornavn Etternavn"
                    value={form.restrictions_requester.rawValue || ''}
                    onChange={updateFormField(
                      form.restrictions_requester.name,
                      updateForm
                    )}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-md-2" htmlFor="restrictionCause">
                  Årsak til klausulering:
                </label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    id="restrictionCause"
                    value={form.restrictions_reason.rawValue || ''}
                    onChange={updateFormField(form.restrictions_reason.name, updateForm)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="control-label col-md-2"
                  htmlFor="restrictionCaseNumbers"
                >
                  Saksnummer:
                </label>
                <div className="col-md-5">
                  <input
                    className="form-control"
                    id="restrictionCaseNumbers"
                    value={
                      (Array.isArray(form.restrictions_caseNumbers.rawValue) &&
                        form.restrictions_caseNumbers.rawValue.join(', ')) ||
                        ''
                    }
                    onChange={updateArrayField(
                      form.restrictions_caseNumbers.name,
                      updateForm
                    )}
                  />
                </div>
                <div className="col-md-2">
                  <AddButton label="Legg til flere saksnummer" />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="control-label col-md-2"
                  htmlFor="restrictionExpirationEndDate"
                >
                  Sluttdato:
                </label>
                <div className="col-md-5">
                  <input
                    className="form-control"
                    id="restrictionExpirationEndDate"
                    value={form.restrictions_expirationDate.rawValue || ''}
                    onChange={updateFormField(
                      form.restrictions_expirationDate.name,
                      updateForm
                    )}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="control-label col-md-2"
                  htmlFor="restrictionCancellationCause"
                >
                  Årsak til kansellering:
                </label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    id="restrictionCancellationCause"
                    value={form.restrictions_cancelledReason.rawValue || ''}
                    onChange={updateFormField(
                      form.restrictions_cancelledReason.name,
                      updateForm
                    )}
                  />
                </div>
              </div>
            </div>}
        </div>
        <hr />
        <button
          className="btn btn-primary"
          onClick={submitForm(
            appSession,
            form,
            location,
            saveAnalysis,
            saveResult,
            goToUrl
          )}
        >
          Lagre
        </button>
        {' '}
        <button
          className="btn btn-default"
          onClick={(e: { preventDefault: () => void }) => {
            e.preventDefault();
            goBack();
          }}
        >
          Avbryt
        </button>
      </form>
    </div>
  );
};

export function updateFormField(field: string, updateForm: Function) {
  return (e: { target: { value: string } }) =>
    updateForm({
      name: field,
      rawValue: e.target.value
    });
}

export function updateArrayField(field: string, updateForm: Function) {
  return (e: { target: { value: string } }) =>
    updateForm({
      name: field,
      rawValue: e.target.value.split(',').map(v => v.trim())
    });
}

export function updateBooleanField(b: boolean) {
  return (field: string, updateForm: Function) => () =>
    updateForm({
      name: field,
      rawValue: b
    });
}

export function getAnalysisTypeTerm(store: Store, appSession: AppSession) {
  if (store.analysis && store.analysis.analysisTypeId && store.analysisTypes) {
    const analysisTypeId = store.analysis.analysisTypeId;
    const foundType = store.analysisTypes.find(type => type.id === analysisTypeId);
    if (foundType) {
      return appSession.language.isEn ? foundType.enName : foundType.noName;
    }
  }
  return '';
}

export function submitForm(
  appSession: AppSession,
  form: FormData,
  location?: Location,
  saveAnalysisEvent: SaveAnalysisFn,
  saveResult: Function,
  goToUrl: (s: string) => void
) {
  return (e: { preventDefault: Function }) => {
    e.preventDefault();
    const restriction = form.restrictions.value
      ? {
          requester: form.restrictions_requester.value,
          expirationDate: form.restrictions_expirationDate.value,
          reason: form.restrictions_reason.value,
          caseNumbers: form.restrictions_caseNumbers.value,
          cancelledReason: form.restrictions_cancelledReason.value
        }
      : null;

    const result = {
      extRef: form.externalSource.value ? [form.externalSource.value] : null,
      comment: form.comments.value,
      type: 'GenericResult'
    };
    const doneBy = form.persons ? form.persons.rawValue.find(p => p.role==='doneBy') : undefined;
    const responsible =form.persons ? form.persons.rawValue.find(p => p.role==='responsible') : undefined;
    console.log('Form: ',form);

    const data = {
      analysisTypeId: form.analysisTypeId.value,
      doneBy: doneBy && doneBy.uuid,
      doneDate: doneBy && doneBy.date,
      note: form.note.value,
      responsible: responsible && responsible.uuid,
      administrator: null,
      completedBy: null,
      completedDate: null,
      restriction,
      objectIds: location && location.state ? location.state.map(a => a.uuid) : [],
      caseNumbers: form.caseNumbers.value,
      status: form.status.value,
      reason: form.reason.value,
      result,
      type: 'AnalysisCollection'
    };

    return saveAnalysisEvent({
      id: form.id.value,
      museumId: appSession.museumId,
      data: data,
      token: appSession.accessToken
    }).then((analysis: number | { id: number }) => {
      const analysisId = typeof analysis === 'number' ? analysis : analysis.id;
      const url = Config.magasin.urls.client.analysis.viewAnalysis(
        appSession,
        analysisId
      );
      return saveResult({
        token: appSession.accessToken,
        museumId: appSession.museumId,
        result,
        analysisId
      }).then(() => {
        goToUrl(url);
      });
    });
  };
}

export default AnalysisForm;
