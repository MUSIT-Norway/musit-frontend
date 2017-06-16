// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../types/appSession';
import type { ObjectData } from '../../types/object';
import type { SampleData } from '../../types/samples';
import type { FormData } from './shared/formType';
import type { Store } from './shared/storeType';
import PersonRoleDate from '../../components/person/PersonRoleDate';
import AddButton from '../../components/AddButton';
import MetaInformation from '../../components/metainfo';
import ObjectResultTable from './components/ExpandableObjectResultTable';
import Restrictions from './components/Restrictions';
import Result from './components/Result';
import { getStatusText } from './AnalysisViewComponent';
import type { Predefined } from './shared/predefinedType';
import toString from 'lodash/toString';
import toArray from 'lodash/toArray';

type Props = {
  form: FormData,
  updateForm: Function,
  updateArrayField: Function,
  updateBooleanField: Function,
  updateStringField: Function,
  getAnalysisTypeTerm: Function,
  store: Store,
  appSession: AppSession,
  objects: Array<ObjectData & SampleData & { sampleType: string, sampleSubType: string }>,
  predefined: Predefined,
  clickSave: Function,
  clickCancel: Function
};

const AnalysisForm = ({
  form,
  updateForm,
  updateArrayField,
  updateBooleanField,
  updateStringField,
  getAnalysisTypeTerm,
  predefined,
  appSession,
  objects,
  clickSave,
  clickCancel
}: Props) => {
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
                    onChange={updateStringField(form.analysisTypeCategory.name)}
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
                      onChange={updateStringField(form.analysisTypeId.name)}
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
                  {getAnalysisTypeTerm(predefined)}
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
              onChange={updateStringField(form.reason.name)}
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
              onChange={updateStringField(form.status.name)}
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
              onChange={updateStringField(form.orgId.name)}
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
              onChange={updateArrayField(form.caseNumbers.name)}
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
              onChange={updateStringField(form.note.name)}
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
          personData={toArray(form.persons.value)}
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
              <ObjectResultTable data={objects} updateForm={updateForm} />
            </div>
            <div className="col-md-11 col-md-offset-0">
              <AddButton label={I18n.t('musit.analysis.addMoreObjectOrSample')} />
            </div>
          </div>
          <hr />
          <Result
            externalSource={toArray(form.externalSource.rawValue).join(',')}
            updateExternalSource={rawValue =>
              updateForm({
                name: form.externalSource.name,
                rawValue: rawValue.split(',').map(v => v.trim())
              })}
            comments={toString(form.comments.rawValue)}
            updateComments={rawValue =>
              updateForm({ name: form.comments.name, rawValue })}
          />
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
                    onChange={updateBooleanField(form.restrictions.name, true)}
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
                    onChange={updateBooleanField(form.restrictions.name, false)}
                  />
                  {' '}
                  {I18n.t('musit.texts.no')}
                </label>
              </div>
            </div>
          </div>
          {form.restrictions.value &&
            <Restrictions appSession={appSession} form={form} updateForm={updateForm} />}
        </div>
        <hr />
        <button className="btn btn-primary" onClick={clickSave}>
          {I18n.t('musit.texts.save')}
        </button>
        {' '}
        <button className="btn btn-default" onClick={clickCancel}>
          {I18n.t('musit.texts.cancel')}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;
