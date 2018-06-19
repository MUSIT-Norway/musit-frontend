// @flow
import * as React from 'react';
import { I18n } from 'react-i18nify';
import Config from '../../config';
import { AppSession } from '../../types/appSession';
import { History } from 'history';

type Props = {
  appSession: AppSession;
  objectId: string;
  history: History;
  className?: string;
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
