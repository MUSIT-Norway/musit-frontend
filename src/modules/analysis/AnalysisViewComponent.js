// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import MetaInformation from '../../components/metainfo';
import ObjectTable from './components/ExpandableObjectResultTable';
import toArray from 'lodash/toArray';
import ViewResult from './components/ViewResult';
import ViewPersonRoleDate from '../../components/person/ViewPersonRoleDate';
import type { FormData } from './shared/formType';
import { getParentObjectId } from './shared/getters';
import type { AnalysisStoreState } from './analysisStore';
import type { AppSession } from '../../types/appSession';
import type { AnalysisEvent, ExtraResultAttributeValues } from '../../types/analysis';
import type { History } from '../../types/Routes';
import ViewRestriction from './components/ViewRestriction';
import MusitI18n from '../../components/MusitI18n';
import type { Predefined } from '../../types/predefined';

export type Props = {
  match: { params: { analysisId: string } },
  form: FormData,
  store: AnalysisStoreState,
  analysisPurpose: string,
  analysisTypeTerm: string,
  statusText: string,
  labPlaceText: string,
  objects: Array<AnalysisEvent>,
  clickEdit: Function,
  extraDescriptionAttributes: any,
  extraResultAttributes: ?ExtraResultAttributeValues,
  history: History,
  appSession: AppSession,
  cancelRestriction: Function,
  updateRestriction: Function,
  updateAnalysis: Function,
  loadingAnalysis: boolean,
  hasRestrictions: ?boolean,
  toggleCancelDialog: Function,
  isRestrictionValidForCancellation: boolean,
  predefined: Predefined,
  clearForm: Function,
  clearStore: Function,
  getAnalysis: Function,
  loadForm: Function
};

export default (props: Props) =>
  !props.loadingAnalysis ? (
    <div className="container">
      <div className="page-header">
        {props.appSession.rolesForModules.collectionManagementWrite && (
          <button className="btn btn-default pull-right" onClick={props.clickEdit}>
            {I18n.t('musit.texts.change')}
          </button>
        )}
        <h1>{I18n.t('musit.analysis.analysis')}</h1>
      </div>
      <form className="form-horizontal">
        <MetaInformation
          updatedBy={props.form.updatedByName.value}
          updatedDate={props.form.updatedDate.value}
          registeredBy={props.form.registeredByName.value}
          registeredDate={props.form.registeredDate.value}
        />
        <hr />
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="type">
            {I18n.t('musit.analysis.analysisType')}
          </label>
          <div className="col-md-10">
            <p className="form-control-static" id="type">
              {props.analysisTypeTerm}
            </p>
          </div>
        </div>
        {props.extraDescriptionAttributes.map((attr, i) => (
          <div className="form-group" key={i}>
            <label className="control-label col-md-2" htmlFor="type">
              {I18n.t('musit.analysis.analysisAttributes.' + attr.attributeKey)}
            </label>
            <div className="col-md-3" id="idExtraDescriptionAttributes">
              {Array.isArray(attr.attributeValue) ? (
                <ul class="list-unstyled" id="avc--extraDescriptionAttributesTypes">
                  {attr.attributeValue.map(attrId =>
                    attr.allowedValues
                      .filter(allowedValue => allowedValue.id === attrId)
                      .map(fav => (
                        <li>
                          <MusitI18n key={fav.id} en={fav.enLabel} no={fav.noLabel} />
                        </li>
                      ))
                  )}
                </ul>
              ) : (
                <p className="form-control-static">{attr.attributeValue}</p>
              )}
            </div>
          </div>
        ))}
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="reason">
            {I18n.t('musit.analysis.reason')}{' '}
          </label>
          <div className="col-md-10">
            <p className="form-control-static" id="reason">
              {props.analysisPurpose}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="status">
            {I18n.t('musit.analysis.status')}
          </label>
          <div className="col-md-5">
            <p className="form-control-static" id="status">
              {props.statusText}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="status">
            {I18n.t('musit.analysis.place')}
          </label>
          <div className="col-md-5">
            <p className="form-control-static" id="status">
              {props.labPlaceText}
            </p>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="caseNumber">
            {I18n.t('musit.analysis.caseNumber')}
          </label>
          <div className="col-md-10">
            <p className="form-control-static" id="caseNumber">
              {props.form.caseNumbers.value &&
                Array.isArray(props.form.caseNumbers.value) &&
                props.form.caseNumbers.value.join(', ')}
            </p>
          </div>
        </div>
        <hr />
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="note">
            {I18n.t('musit.analysis.note')}
          </label>
          <div className="col-md-10">
            <p className="form-control-static" id="note">
              {props.form.note.value}
            </p>
          </div>
        </div>
        <hr />
        <div className="form-group">
          <label className="control-label">
            {I18n.t('musit.analysis.personTillAnalysis')}
          </label>
        </div>
        <ViewPersonRoleDate
          personData={toArray(props.form.persons.value)}
          getDisplayNameForRole={(r: string) => I18n.t(`musit.analysis.roles.${r}`)}
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
              <ObjectTable
                extraAttributes={props.extraResultAttributes}
                data={props.objects}
                appSession={props.appSession}
                history={props.history}
                viewMode={true}
              />
            </div>
          </div>
          <hr />
          <ViewResult
            files={props.store.analysis ? props.store.analysis.files : []}
            extraAttributes={props.extraResultAttributes}
            externalSource={toArray(props.form.externalSource.value).join(',')}
            comments={props.form.comments.value}
            appSession={props.appSession}
            history={props.history}
            parentObjectId={
              props.objects && props.objects.length === 1 ? (
                getParentObjectId(props.objects[0])
              ) : null
            }
          />
          <div className="form-group">
            <label className="control-label col-md-2" htmlFor="restrictions">
              {I18n.t('musit.analysis.restrictions.restrictions')}
            </label>
            <div className="col-md-10">
              <p className="form-control-static" id="restrictions">
                {props.hasRestrictions ? (
                  I18n.t('musit.texts.yes')
                ) : (
                  I18n.t('musit.texts.no')
                )}
              </p>
            </div>
          </div>
          {!!(
            props.hasRestrictions &&
            props.store.analysis &&
            props.store.analysis.restriction
          ) && (
            <ViewRestriction
              restriction={props.store.analysis.restriction}
              appSession={props.appSession}
              updateRestriction={props.updateRestriction}
              showCancelDialog={props.store.showRestrictionCancelDialog}
              toggleCancelDialog={props.toggleCancelDialog}
              isRestrictionValidForCancellation={props.isRestrictionValidForCancellation}
              cancelRestriction={props.cancelRestriction}
              viewMode={true}
            />
          )}
        </div>
      </form>
    </div>
  ) : (
    <div className="loading" />
  );
