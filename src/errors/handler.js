import React from 'react';
import NotificationSystem from 'react-notification-system';
import event$ from './emitter';
import { I18n } from 'react-i18nify';
import ReactDOM from 'react-dom';
import * as logger from 'loglevel';

const notificationSystem = ReactDOM.render(<NotificationSystem />, document.getElementById('errors'));

const children = (message) =>
  <div style={{margin: '30px'}}>
    <p>
      {message}
    </p>
  </div>;

const handleNotification = (event) => {
  switch(event.type) {
  case 'deleteSuccess':
    notificationSystem.addNotification({
      level: 'success',
      title: I18n.t('musit.notificationMessages.deleting'),
      position: 'tc',
      children: children(event.message)
    });
    break;
  case 'movedSuccess':
    notificationSystem.addNotification({
      level: 'success',
      title: I18n.t('musit.notificationMessages.moving'),
      position: 'tc',
      children: children(event.message)
    });
    break;
  case 'saveSuccess':
    notificationSystem.addNotification({
      level: 'success',
      title: I18n.t('musit.notificationMessages.saving'),
      position: 'tc',
      children: children(event.message)
    });
    break;
  default:
    notificationSystem.addNotification({
      level: 'success',
      children: children(event.message)
    });
  }
};

const getErrorMessage = (status) => {
  switch(status) {
  case 404:
    return I18n.t('musit.errorMainMessages.notFound');
  case 401:
    return I18n.t('musit.errorMainMessages.notAuthenticated');
  case 403:
    return I18n.t('musit.errorMainMessages.notAllowed');
  case 400:
    return I18n.t('musit.errorMainMessages.badRequest');
  case 500:
    return I18n.t('musit.errorMainMessages.applicationError');
  default:
    return I18n.t('musit.errorMainMessages.errorCode', { status });
  }
};

const handleError = (event) => {
  const error = event.error || event;
  const type = event.type;
  switch(type) {
  case 'network':
    const response = error.response;
    const msg = response.body && response.body.message || getErrorMessage(response.status);
    notificationSystem.addNotification({
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.networkError'),
      position: 'tc',
      children: children(msg)
    });
    break;
  case 'dateValidationError':
    notificationSystem.addNotification({
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(error.message)
    });
    break;
  case 'errorOnDelete':
    notificationSystem.addNotification({
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(error.message)
    });
    break;
  case 'errorOnMove':
    notificationSystem.addNotification({
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(error.message)
    });
    break;
  case 'errorOnSave':
    notificationSystem.addNotification({
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(error.message)
    });
    break;
  default:
    logger.debug(error);
    notificationSystem.addNotification({
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(error.message)
    });
  }
};

event$.subscribe((event) => {
  switch(event.type) {
  case 'musitNotification':
    handleNotification(event.payload);
    break;
  case 'musitError':
    handleError(event.payload);
    break;
  default:
  }
});