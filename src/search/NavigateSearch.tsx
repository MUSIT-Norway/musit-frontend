// @flow

import * as React from 'react';
import { I18n } from 'react-i18nify';
import Config from '../config';
import { AppSession } from '../types/appSession';

export type Props = {
  history: (url: string) => void;
  appSession: AppSession;
  disableAnalysis?: boolean;
  disableConservation?: boolean;
  disableObject?: boolean;
};

const NavigateSearch = (props: Props) => (
  <div className="row">
    <button
      className="btn btn-default pull-right"
      style={{
        marginRight: '20px',
        marginTop: '40px',
        marginBottom: '-40px',
        color: props.disableObject ? 'Gray' : 'inherit'
      }}
      disabled={props.disableObject}
      onClick={e => {
        e.preventDefault();
        return (
          !props.disableObject &&
          props.history(
            Config.magasin.urls.client.searchObjects.goToSearchObjects(props.appSession)
          )
        );
      }}
    >
      {I18n.t('musit.objectsearch.title')}
    </button>

    {props.appSession.rolesForModules.collectionManagementRead && (
      <button
        className="btn btn-default pull-right"
        style={{
          marginRight: '20px',
          marginTop: '40px',
          marginBottom: '-40px',
          color: props.disableConservation ? 'Gray' : 'inherit'
        }}
        disabled={props.disableConservation}
        onClick={e => {
          e.preventDefault();
          return (
            !props.disableConservation &&
            props.history(
              Config.magasin.urls.client.conservation.baseUrl(props.appSession)
            )
          );
        }}
      >
        {I18n.t('musit.conservation.conservation')}
      </button>
    )}
    {props.appSession.rolesForModules.collectionManagementRead && (
      <button
        className="btn btn-default pull-right"
        style={{
          marginRight: '20px',
          marginTop: '40px',
          marginBottom: '-40px',
          color: props.disableAnalysis ? 'Gray' : 'inherit'
        }}
        disabled={props.disableAnalysis}
        onClick={e => {
          e.preventDefault();
          return (
            !props.disableAnalysis &&
            props.history(Config.magasin.urls.client.analysis.baseUrl(props.appSession))
          );
        }}
      >
        {I18n.t('musit.analysis.analysis')}
      </button>
    )}
       {props.appSession.rolesForModules.collectionManagementRead && (
      <button
        className="btn btn-default pull-right"
        style={{
          marginRight: '20px',
          marginTop: '40px',
          marginBottom: '-40px',
          color: props.disableAnalysis ? 'Gray' : 'inherit'
        }}
        disabled={props.disableAnalysis}
        onClick={e => {
          e.preventDefault();
          return (
            !props.disableAnalysis &&
            props.history(Config.magasin.urls.client.person.searchPerson(props.appSession))
          );
        }}
      >
        Person
      </button>
    )}
  </div>
);

export default NavigateSearch;
