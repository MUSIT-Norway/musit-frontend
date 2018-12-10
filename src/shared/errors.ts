import { Subject, Observable } from 'rxjs';
import { I18n } from 'react-i18nify';
import { TODO } from '../types/common';

//TODO: Not sure what this really is, just guessing which properties belong here
// (as well as the name of the type)
interface InputEvent {
  type?:
    | 'deleteSuccess'
    | 'movedSuccess'
    | 'saveSuccess'
    | 'network'
    | 'dateValidationError'
    | 'errorOnDelete'
    | 'errorOnMove'
    | 'errorOnSave';
  message?: string;
}

/* Fra første utkast på migrering til TS, tror ikke dette er riktig, kan fjernes når 
vi er ferdig med migreringen til TS (eller før :) ) 
interface EventMessage {
  type?:
    | "deleteSuccess"
    | "movedSuccess"
    | "saveSuccess"
    | "network"
    | "dateValidationError"
    | "errorOnDelete"
    | "errorOnMove"
    | "errorOnSave";
  level: "success" | "error" | "warning" | "info";
  title?: string;
  message?: string;
  error?: MessageEvent;
  body?: string;
  autoDismiss?: number;
 
}
*/

const handleSuccess: TODO = new Subject().map((event: InputEvent) => {
  switch (event.type) {
    case 'deleteSuccess':
      return {
        level: 'success',
        title: I18n.t('musit.notificationMessages.deleting'),
        message: event.message
      };
    case 'movedSuccess':
      return {
        level: 'success',
        title: I18n.t('musit.notificationMessages.moving'),
        message: event.message
      };
    case 'saveSuccess':
      return {
        level: 'success',
        title: I18n.t('musit.notificationMessages.saving'),
        message: event.message
      };
    default:
      return {
        level: 'success',
        message: event.message
      };
  }
});

export const emitSuccess = (event: TODO) => handleSuccess.next(event);

const getErrorStatus = (error: TODO) => {
  const status = error && (error.status || (error.response && error.response.status));
  if (!status) {
    return;
  }
  switch (status) {
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

const getErrorMessage = (error: TODO) => {
  return error.response && error.response.body && error.response.body.message;
};

const handleWarning: TODO = new Subject().map((event: TODO) => {
  const customMessage = event.message;
  return {
    level: 'warning',
    title: I18n.t('musit.errorMainMessages.applicationWarning'),
    message: customMessage
  };
});

const handleError: TODO = new Subject().map((event: TODO) => {
  const error = event.error || event;
  const type = event.type;
  let eMsg, eStatus, customMessage;

  switch (type) {
    case 'network':
      eMsg = getErrorMessage(error);
      eStatus = getErrorStatus(error);
      return {
        level: 'error',
        title: I18n.t('musit.errorMainMessages.networkError'),
        message: eMsg || eStatus
      };
    case 'dateValidationError':
      return {
        level: 'error',
        title: I18n.t('musit.errorMainMessages.applicationError'),
        message: error.message
      };
    case 'errorOnDelete':
      return {
        level: 'error',
        title: I18n.t('musit.errorMainMessages.applicationError'),
        message: error.message
      };
    case 'errorOnMove':
      customMessage = event.message;
      eMsg = getErrorMessage(error);
      eStatus = getErrorStatus(error);
      return {
        level: 'error',
        title: I18n.t('musit.errorMainMessages.applicationError'),
        message: `${customMessage} ${eMsg || eStatus || ''}`
      };
    case 'errorOnSave':
      return {
        level: 'error',
        title: I18n.t('musit.errorMainMessages.applicationError'),
        message: error.message
      };
    case 'latLongError':
      return {
        level: 'error',
        title: 'Illegal coordinate',
        message:
          'Legal formats are: \n' +
          'DMS 60 10 23N 10 23 13E \n' +
          'No space before N/S and E/W)\n' +
          'M and S can be omitted  (69 34N 19E) \n' +
          'Decimal degrees: \n' +
          '60.234 10.233 (N/S is first number, and E/W is last number\n' +
          'Negative numbers are interpreted as South og West'
      };
    case 'utmError':
      return {
        level: 'error',
        title: 'Illegal coordinate',
        message:
          'Legal formats are: \n' +
          'E/W N/S\n' +
          'First number is E/W and second is N/S\n' +
          'E/W and N/S are separated by space or ","'
      };
    case 'mgrsError':
      return {
        level: 'error',
        title: 'Illegal coordinate',
        message:
          'Legal formats are: \n' +
          'NM 3453,3434 or NM-NN 343-432, 345 or NM 432, 345-455\n' +
          'Easting and Northing is separated by ","\n' +
          'Legal number of digits are 1 - 5'
      };
    default:
      customMessage = event.message;
      eMsg = getErrorMessage(error);
      return {
        level: 'error',
        title: I18n.t('musit.errorMainMessages.applicationError'),
        message: customMessage || eMsg || ''
      };
  }
});

export const emitError = (event: TODO) => handleError.next(event);
export const emitWarning = (event: TODO) => handleWarning.next(event);

export default Observable.merge(handleSuccess, handleError, handleWarning);
