// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import MetaInformation from '../../components/metainfo';
import toArray from 'lodash/toArray';
import ObjectTable from './components/expandableObjects';
import ViewPersonRoleDate from '../../components/person/ViewPersonRoleDate';
import type { FormData } from './shared/formType';
import type { AppSession } from '../../types/appSession';
import type { ConservationStoreState } from '../../types/conservation';
import type { History } from '../../types/Routes';
import type { PredefinedConservation } from '../../types/predefinedConservation';
import Treatment from './events/treatment';
import TechnicalDescription from './events/technicalDescription';

export type Props = {
  match: { params: { conservationId: number } },
  form: FormData,
  store: ConservationStoreState,
  objects: any,
  clickEdit: Function,
  history: History,
  appSession: AppSession,
  loadingConservation: boolean,
  predefinedConservation: PredefinedConservation,
  clearForm: Function,
  clearStore: Function,
  getConservation: Function,
  loadForm: Function,
  goBack: () => void
};

const addEventComponents = (
  index: number,
  event: any,
  conservationTypes: any,
  appSession: AppSession,
  objects: any
) => {
  if (event.eventTypeId === 2)
    return (
      <Treatment
        name={`treatment_${index}`}
        affectedThingsWithDetailsMainEvent={objects}
        materials={conservationTypes.materialList}
        keywords={conservationTypes.keywordList}
        treatment={{
          keywords: event.keywords,
          materials: event.materials,
          note: event.note,
          affectedThings: event.affectedThings
        }}
        index={index}
        appSession={appSession}
        viewMode={true}
      />
    );
  else if (event.eventTypeId === 3)
    return (
      <TechnicalDescription
        affectedThingsWithDetailsMainEvent={objects}
        technicalDescription={{
          note: event.note,
          affectedThings: event.affectedThings
        }}
        index={index}
        appSession={appSession}
        viewMode={true}
      />
    );
  else return '';
};

const suffix = ':';

export default (props: Props) =>
  !props.loadingConservation ? (
    <div className="container">
      <div className="page-header">
        <button className="btn btn-default pull-right" onClick={props.clickEdit}>
          {I18n.t('musit.texts.change')}
        </button>
        <h1>{I18n.t('musit.conservation.conservation')}</h1>
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
          <label className="control-label col-md-2" htmlFor="caseNumber">
            {I18n.t('musit.conservation.caseNumber') + suffix}
          </label>
          <div className="col-md-10">
            <p className="form-control-static" id="caseNumber">
              {props.form.caseNumber.value}
            </p>
          </div>
        </div>
        <hr />
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="note">
            {I18n.t('musit.conservation.comments') + suffix}
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
            {I18n.t('musit.conservation.personsConnected')}
          </label>
        </div>
        <ViewPersonRoleDate
          personData={toArray(props.form.persons.value)}
          getDisplayNameForRole={(r: string) => I18n.t(`musit.conservation.roles.${r}`)}
        />
        <hr />
        <div className="well">
          <div className="form-group">
            <label className="col-md-12" htmlFor="objects">
              {I18n.t('musit.conservation.objectsOrSamples')}
            </label>
          </div>
          <div className="form-group">
            <div className="col-md-12 col-md-offset-0">
              <ObjectTable
                data={
                  (props.store.conservation && props.store.conservation.affectedThings) ||
                  []
                }
                appSession={props.appSession}
                history={props.history}
                viewMode={true}
              />
            </div>
          </div>
          <hr />
        </div>
        {props.store &&
          props.store.conservation &&
          props.store.conservation.events &&
          props.store.conservation.events.map((e, index) =>
            addEventComponents(
              index,
              e,
              props.predefinedConservation,
              props.appSession,
              props.store.conservation && props.store.conservation.affectedThings
            )
          )}
        <hr />
        <button className="btn-link" style={{ marginLeft: 20 }} onClick={props.goBack}>
          {I18n.t('musit.texts.cancel')}
        </button>
      </form>
    </div>
  ) : (
    <div className="loading" />
  );
