// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import Config from '../../config';
import type { AppSession } from '../../types/appSession';
import type { ObjectData } from '../../types/object';
import type { SampleData } from '../../types/samples';
import type { FormData } from './types/form';
import type { Store } from './types/store';
import PersonRoleDate from '../../components/person/PersonRoleDate';
import AddButton from '../../components/AddButton';
import MetaInformation from '../../components/metainfo';
import { ActorSuggest } from '../../components/suggest/ActorSuggest';
import DatePicker from '../../components/DatePicker';
import { DATE_FORMAT_DISPLAY, formatISOString } from '../../shared/util';
import ObjectTable from '../objects/components/ObjectTable';
import { getStatusText } from './AnalysisViewComponent';

type Location = {
  state?: Array<ObjectData & SampleData & { sampleType: string, sampleSubType: string }>
};

type SaveAnalysisFn = (props: {
  museumId: number,
  data: mixed,
  token: string
}) => Promise<*>;

type Predefined = {
  analysisTypes: Array<any>,
  purposes: Array<any>,
  analysisLabList: Array<any>,
  categories: {}
};

type Props = {
  form: FormData,
  updateForm: Function,
  store: Store,
  appSession: AppSession,
  saveAnalysis: SaveAnalysisFn,
  saveResult: Function,
  location: Location,
  predefined: Predefined,
  goToUrl: (s: string) => void,
  goBack: () => void
};

const AnalysisForm = ({
  form,
  updateForm,
  store,
  predefined,
  saveAnalysis,
  saveResult,
  appSession,
  location,
  goToUrl,
  goBack
}: Props) => {
  const objectData = location && location.state
    ? location.state
    : store.analysis ? store.analysis.events : [];
  return (
    <div className="container">
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
          <label className="control-label col-md-2" htmlFor="type">
            {I18n.t('musit.analysis.analysisType')}
          </label>
          {!form.id.value
            ? <div>
                <div className="col-md-5">
                  <select
                    id="type"
                    className="form-control"
                    value={form.analysisTypeCategory.value || ''}
                    onChange={updateFormField(form.analysisTypeCategory.name, updateForm)}
                  >
                    <option value="">{I18n.t('musit.analysis.chooseCategory')}</option>
                    {predefined.categories &&
                      Object.keys(predefined.categories).map(k => (
                        <option key={k} value={k}>{predefined.categories[k]}</option>
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
                      <option value="">{I18n.t('musit.analysis.chooseType')}</option>
                      {predefined.analysisTypes &&
                        predefined.analysisTypes
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
                  {getAnalysisTypeTerm(store, predefined, appSession)}
                </p>
              </div>}
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="reason">
            {I18n.t('musit.analysis.reason')}
          </label>
          <div className="col-md-10">
            <select
              id="reason"
              className="form-control"
              value={form.reason.rawValue || ''}
              onChange={updateFormField(form.reason.name, updateForm)}
            >
              <option value="">{I18n.t('musit.analysis.chooseReason')}</option>
              {predefined.purposes &&
                predefined.purposes.map(a => (
                  <option key={a.id} value={a.id}>
                    {appSession.language.isEn ? a.enPurpose : a.noPurpose}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="status">
            {I18n.t('musit.analysis.status')}
          </label>
          <div className="col-md-10">
            <select
              id="status"
              className="form-control"
              value={form.status.rawValue || ''}
              onChange={updateFormField(form.status.name, updateForm)}
            >
              <option value="">{I18n.t('musit.analysis.chooseStatus')}</option>
              <option value="1">{getStatusText(1)}</option>
              <option value="2">{getStatusText(2)}</option>
              <option value="3">{getStatusText(3)}</option>
              <option value="4">{getStatusText(4)}</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="place">
            {I18n.t('musit.analysis.place')}
          </label>
          <div className="col-md-10">
            <select
              id="place"
              className="form-control"
              value={form.orgId.rawValue || ''}
              onChange={updateFormField(form.orgId.name, updateForm)}
            >
              <option value="">{I18n.t('musit.analysis.choosePlace')}</option>
              {predefined.analysisLabList &&
                predefined.analysisLabList.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.fullName}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="casenumber">
            {I18n.t('musit.analysis.caseNumber')}
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
          <label className="control-label col-md-2" htmlFor="note">
            {I18n.t('musit.analysis.note')}
          </label>
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
          <label className="control-label">
            {I18n.t('musit.analysis.personTillAnalysis')}
          </label>
        </div>
        <PersonRoleDate
          appSession={appSession}
          personData={form.persons.value}
          updateForm={updateForm}
          fieldName={form.persons.name}
          roles={['responsible', 'doneBy', 'administrator', 'completedBy']}
          showDateForRole={(roleName: string) =>
            ['completedBy', 'doneBy'].some(e => e === roleName)}
        />
        <hr />
        <div className="well">
          <div className="form-group">
            <label className="col-md-12" htmlFor="objects">
              {I18n.t('musit.analysis.objectOrSample')}
            </label>
          </div>
          <div className="form-group">
            <div className="col-md-12 col-md-offset-0">
              <ObjectTable objects={objectData} />
            </div>
            <div className="col-md-11 col-md-offset-0">
              <AddButton label={I18n.t('musit.analysis.addMoreObjectOrSample')} />
            </div>
          </div>
          <hr />
          <div className="form-group">
            <label className="control-label col-md-2" htmlFor="externalSource">
              {I18n.t('musit.analysis.externalSource')}
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
              <button className="btn btn-default">{I18n.t('musit.texts.save')}</button>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-md-2" htmlFor="file">
              {I18n.t('musit.texts.uploadFile')}:
            </label>
            <div className="col-md-5">
              <input className="form-control" id="file" />
            </div>
            <div className="col-md-2">
              <button className="btn btn-default">{I18n.t('musit.texts.browse')}</button>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-md-2" htmlFor="resultNote">
              {I18n.t('musit.analysis.commentsToResult')}
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
              {I18n.t('musit.analysis.restrictions.restrictions')}
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
                  {I18n.t('musit.texts.yes')}
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
                  {I18n.t('musit.texts.no')}
                </label>
              </div>
            </div>
          </div>
          {form.restrictions.value &&
            <div>
              <div className="form-group">
                <label className="control-label col-md-2" htmlFor="restrictedBy">
                  {I18n.t('musit.analysis.restrictions.restrictionsFor')}
                </label>
                <div className="col-md-10">
                  <ActorSuggest
                    appSession={appSession}
                    id="restrictions_requester"
                    value={form.restrictions_requesterName.rawValue || ''}
                    placeHolder={I18n.t('musit.analysis.restrictions.findActor')}
                    onChange={e => {
                      updateForm({
                        name: 'restrictions_requesterName',
                        rawValue: e.fn
                      });
                      updateForm({
                        name: 'restrictions_requester',
                        rawValue: e.dataportenId
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-md-2" htmlFor="restrictionCause">
                  {I18n.t('musit.analysis.restrictions.reasonForRestriction')}
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
                  {I18n.t('musit.analysis.restrictions.caseNumber')}
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
                  <AddButton
                    label={I18n.t('musit.analysis.restrictions.addMoreCaseNumbers')}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="control-label col-md-2"
                  htmlFor="restrictionExpirationEndDate"
                >
                  {I18n.t('musit.analysis.restrictions.endDate')}
                </label>
                <div className="col-md-5">
                  <DatePicker
                    dateFormat={DATE_FORMAT_DISPLAY}
                    value={form.restrictions_expirationDate.rawValue || ''}
                    onChange={e =>
                      updateForm({
                        name: 'restrictions_expirationDate',
                        rawValue: formatISOString(e)
                      })}
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
            getObjects(location.state),
            saveAnalysis,
            saveResult,
            goToUrl
          )}
        >
          {I18n.t('musit.texts.save')}
        </button>
        {' '}
        <button
          className="btn btn-default"
          onClick={(e: { preventDefault: () => void }) => {
            e.preventDefault();
            goBack();
          }}
        >
          {I18n.t('musit.texts.cancel')}
        </button>
      </form>
    </div>
  );
};

type ObjectWithUuidAndType = { objectId: string, objectType: string };

function getObjects(objects): Array<ObjectWithUuidAndType> {
  return objects
    ? objects.map(obj => ({
        objectId: obj.objectId || obj.uuid,
        objectType: obj.objectType
      }))
    : [];
}

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

export function getAnalysisTypeTerm(
  store: Store,
  predefined: Predefined,
  appSession: AppSession
) {
  if (store.analysis && store.analysis.analysisTypeId && predefined.analysisTypes) {
    const analysisTypeId = store.analysis.analysisTypeId;
    const foundType = predefined.analysisTypes.find(type => type.id === analysisTypeId);
    if (foundType) {
      return appSession.language.isEn ? foundType.enName : foundType.noName;
    }
  }
  return '';
}

export function submitForm(
  appSession: AppSession,
  form: FormData,
  objects: Array<ObjectWithUuidAndType>,
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

    const externalSource = form.externalSource.value;
    const comments = form.comments.value;
    const result = externalSource || comments
      ? {
          extRef: externalSource ? [externalSource] : null,
          comment: comments,
          type: 'GenericResult'
        }
      : null;

    const doneBy = form.persons
      ? form.persons.rawValue.find(p => p.role === 'doneBy')
      : undefined;
    const responsible = form.persons
      ? form.persons.rawValue.find(p => p.role === 'responsible')
      : undefined;

    const administrator = form.persons
      ? form.persons.rawValue.find(p => p.role === 'administrator')
      : undefined;
    const completedBy = form.persons
      ? form.persons.rawValue.find(p => p.role === 'completedBy')
      : undefined;

    const data = {
      analysisTypeId: form.analysisTypeId.value,
      doneBy: doneBy && doneBy.uuid,
      doneDate: doneBy && doneBy.date,
      note: form.note.value,
      responsible: responsible && responsible.uuid,
      administrator: administrator && administrator.uuid,
      completedBy: completedBy && completedBy.uuid,
      completedDate: completedBy && completedBy.date,
      orgId: form.orgId.value,
      restriction,
      objects,
      caseNumbers: form.caseNumbers.value,
      status: form.status.value,
      reason: form.reason.value,
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
      if (result) {
        return saveResult({
          token: appSession.accessToken,
          museumId: appSession.museumId,
          result,
          analysisId
        }).then(() => {
          goToUrl(url);
        });
      } else {
        goToUrl(url);
      }
    });
  };
}

export default AnalysisForm;
