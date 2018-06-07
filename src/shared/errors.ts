import { Subject, Observable } from "rxjs/Rx";
import { I18n } from "react-i18nify";
import { TODO } from "../types/common";

//TODO: Not sure what this really is, just guessing which properties belong here
// (as well as the name of the type)
interface InputEvent {
  type?:
    | "deleteSuccess"
    | "movedSuccess"
    | "saveSuccess"
    | "network"
    | "dateValidationError"
    | "errorOnDelete"
    | "errorOnMove"
    | "errorOnSave";
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
    case "deleteSuccess":
      return {
        level: "success",
        title: I18n.t("musit.notificationMessages.deleting"),
        message: event.message
      };
    case "movedSuccess":
      return {
        level: "success",
        title: I18n.t("musit.notificationMessages.moving"),
        message: event.message
      };
    case "saveSuccess":
      return {
        level: "success",
        title: I18n.t("musit.notificationMessages.saving"),
        message: event.message
      };
    default:
      return {
        level: "success",
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
      return I18n.t("musit.errorMainMessages.notFound");
    case 401:
      return I18n.t("musit.errorMainMessages.notAuthenticated");
    case 403:
      return I18n.t("musit.errorMainMessages.notAllowed");
    case 400:
      return I18n.t("musit.errorMainMessages.badRequest");
    case 500:
      return I18n.t("musit.errorMainMessages.applicationError");
    default:
      return I18n.t("musit.errorMainMessages.errorCode", { status });
  }
};

const getErrorMessage = (error: TODO) => {
  return error.response && error.response.body && error.response.body.message;
};

const handleWarning: TODO = new Subject().map((event: TODO) => {
  const customMessage = event.message;
  return {
    level: "warning",
    title: I18n.t("musit.errorMainMessages.applicationWarning"),
    message: customMessage
  };
});

const handleError: TODO = new Subject().map((event: TODO) => {
  const error = event.error || event;
  const type = event.type;
  let eMsg, eStatus, customMessage;

  switch (type) {
    case "network":
      eMsg = getErrorMessage(error);
      eStatus = getErrorStatus(error);
      return {
        level: "error",
        title: I18n.t("musit.errorMainMessages.networkError"),
        message: eMsg || eStatus
      };
    case "dateValidationError":
      return {
        level: "error",
        title: I18n.t("musit.errorMainMessages.applicationError"),
        message: error.message
      };
    case "errorOnDelete":
      return {
        level: "error",
        title: I18n.t("musit.errorMainMessages.applicationError"),
        message: error.message
      };
    case "errorOnMove":
      customMessage = event.message;
      eMsg = getErrorMessage(error);
      eStatus = getErrorStatus(error);
      return {
        level: "error",
        title: I18n.t("musit.errorMainMessages.applicationError"),
        message: `${customMessage} ${eMsg || eStatus || ""}`
      };
    case "errorOnSave":
      return {
        level: "error",
        title: I18n.t("musit.errorMainMessages.applicationError"),
        message: error.message
      };
    default:
      customMessage = event.message;
      eMsg = getErrorMessage(error);
      return {
        level: "error",
        title: I18n.t("musit.errorMainMessages.applicationError"),
        message: customMessage || eMsg || ""
      };
  }
});

export const emitError = (event: TODO) => handleError.next(event);
export const emitWarning = (event: TODO) => handleWarning.next(event);

export default Observable.merge(handleSuccess, handleError, handleWarning);
