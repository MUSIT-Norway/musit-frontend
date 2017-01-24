import React from 'react';
import { Subject } from 'rxjs/Rx';
import { I18n } from 'react-i18nify';

const children = (message) =>
  <div style={{margin: '30px'}}>
    <p>
      {message}
    </p>
  </div>;

const handleNotification = (event) => {
  switch(event.type) {
  case 'deleteSuccess':
    return {
      level: 'success',
      title: I18n.t('musit.notificationMessages.deleting'),
      position: 'tc',
      children: children(event.message)
    };
  case 'movedSuccess':
    return {
      level: 'success',
      title: I18n.t('musit.notificationMessages.moving'),
      position: 'tc',
      children: children(event.message)
    };
  case 'saveSuccess':
    return {
      level: 'success',
      title: I18n.t('musit.notificationMessages.saving'),
      position: 'tc',
      children: children(event.message)
    };
  default:
    return {
      level: 'success',
      children: children(event.message)
    };
  }
};

// const handleWarning = (event) => {
//   return {
//     level: 'warning',
//     title: I18n.t('musit.notificationMessages.deleting'),
//     position: 'tc',
//     children: children(event.message)
//   };
// };

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
    return {
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.networkError'),
      position: 'tc',
      children: children(eMsg || eStatus)
    };
  case 'dateValidationError':
    return {
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(error.message)
    };
  case 'errorOnDelete':
    return {
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(error.message)
    };
  case 'errorOnMove':
    customMessage = event.message;
    eMsg = getErrorMessage(error);
    eStatus = getErrorStatus(error);
    return {
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(`${customMessage} ${eMsg || eStatus || ''}`)
    };
  case 'errorOnSave':
    return {
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(error.message)
    };
  default:
    customMessage = event.message;
    eMsg = getErrorMessage(error);
    return {
      autoDismiss: 0,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.applicationError'),
      position: 'tc',
      children: children(customMessage || eMsg || '')
    };
  }
};

export const event$ = new Subject();
export const emitSuccess = (event) => event$.next({ type: 'notification', payload: event });
export const emitError = (event) => event$.next({ type: 'error', payload: event });
//export const emitWarning = (event) => event$.next({ type: 'warning', payload: event });

export default event$.asObservable().map(event => {
  switch(event.type) {
  case 'notification':
    return handleNotification(event.payload);
//case 'warning':
//  return handleWarning(event.payload);
  case 'error':
    return handleError(event.payload);
  default:
    throw new Error('Unrecognized event type: ' + event.type);
  }
});