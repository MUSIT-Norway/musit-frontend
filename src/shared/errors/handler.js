import React from 'react';
import NotificationSystem from 'react-notification-system';
import event$ from './emitter';
import { I18n } from 'react-i18nify';
import ReactDOM from 'react-dom';

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

const getErrorStatus = (error) => {
  const status = error && error.response && error.response.status;
  if (!status) {
    return;
  }
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

const getErrorMessage = (error) => {
  return error.response && error.response.body && error.response.body.message;
};

const handleError = (event) => {
  const error = event.error || event;
  const type = event.type;
  let eMsg, eStatus, customMessage;

  switch(type) {
  case 'network':
    eMsg = getErrorMessage(error);
    eStatus = getErrorStatus(error);
    notificationSystem.addNotification({
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.networkError'),
      position: 'tc',
      children: children(eMsg || eStatus)
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
    customMessage = event.message;
    eMsg = getErrorMessage(error);
    eStatus = getErrorStatus(error);
    notificationSystem.addNotification({
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(`${customMessage} ${eMsg || eStatus || ''}`)
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
    customMessage = event.message;
    eMsg = getErrorMessage(error);
    notificationSystem.addNotification({
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(customMessage || eMsg || '')
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