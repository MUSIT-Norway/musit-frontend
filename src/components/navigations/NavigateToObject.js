// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import Config from '../../config';
import type { AppSession } from '../../types/appSession';
import type { History } from '../../types/Routes';

type Props = {
  appSession: AppSession,
  objectId: string,
  history: History,
  className?: string
};

const NavigateToObject = (props: Props) => {
  return (
    <button
      type="button"
      className={`btn btn-link ${props.className || ''}`}
      onClick={e => {
        e.preventDefault();
        props.history.push(
          Config.magasin.urls.client.object.gotoObject(props.appSession, props.objectId)
        );
      }}
    >
      <strong>{' ' + I18n.t('musit.objects.goToParentObject')}</strong>
    </button>
  );
};

export default NavigateToObject;
