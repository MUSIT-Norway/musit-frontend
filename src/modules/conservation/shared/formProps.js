// @flow
import { getObjects, getConservationCollection } from "../shared/submit";
import { saveConservation$, deleteConservation$ } from "../conservationStore";
import type { Location } from "../shared/submit";
import { simplePost, simplePut } from "../../../shared/RxAjax";
import type { History } from "../../../types/Routes";
import type { AppSession } from "../../../types/appSession";

import type { PredefinedConservation } from "../../../types/predefinedConservation";
import type { Person } from "../../../types/person";
import type {
  ConservationStoreState as Store,
  ConservationSubTypes,
  EditableValuesForm,
  FormData
} from "../../../types/conservation";
import type { DomEvent } from "../../../types/dom";
import toArray from "lodash/toArray";
import type { ObjectData } from "../../../types/object";
import { isFormValid } from "../../../forms/validators";
import { emitError, emitSuccess } from "../../../shared/errors";
import Config from "../../../config";
import { sortBy } from "lodash";
import { Observable } from "rxjs";
import { getFormEvents, getFids } from "./utils";
import { uploadFile } from "../../../models/conservation/documents";
import { showConfirm } from "../../../shared/modal";
import {
  formatISOString,
  measurementDeterminationTypeId
} from "../../../shared/util";
import { getCurrentMeasurementDataForObject } from "../../../models/conservation/conservation";

import { I18n } from "react-i18nify";

type FormProps = {|
  updateForm: Function,
  store: Store,
  appSession: AppSession,
  form: FormData,
  history: History,
  predefinedConservation?: PredefinedConservation,
  location: Location<Array<ObjectData>>
|};

export default function formProps(
  props: FormProps,
  ajaxPost: Function = simplePost,
  ajaxPut: Function = simplePut
) {
  return {
    ...props,
    isFormValid: isFormValid(props.form),
    objects: getObjects(
      toArray(props.form.affectedThings.value),
      props.location
    ),
    updateStringField: updateStringField(props.updateForm),
    updateBooleanField: updateBooleanField(props.updateForm),
    updateArrayField: updateArrayField(props.updateForm),
    updateMultiSelectField: updateMultiSelectField(props.updateForm),
    updateConservationSubEvent: updateConservationSubEvent(props.updateForm),
    updatePersonsForSubEvent: updatePersonsForSubEvent(props.updateForm),
    toggleExpanded: toggleExpanded(props.updateForm),
    toggleObjectsExpanded: toggleObjectsExpanded(props.updateForm),
    toggleSingleExpanded: toggleSingleExpanded(props.updateForm),
    updateSingleObjectField: updateSingleObjectField(props.updateForm),
    addNewSubEvent: addNewSubEvent,
    onClickBack: onClickBack(props),
    onDocumentUpload: onDocumentUpload(
      props.form,
      props.appSession,
      props.location,
      props.updateForm,
      props.history
    ),
    onEdit: onEdit(props.updateForm),
    onDelete: onDelete(props.updateForm, props.appSession),
    onCancel: onCancel(props.updateForm),
    onSave: onSave(
      props.form,
      props.appSession,
      props.history,
      props.location,
      ajaxPost,
      ajaxPut,
      props.updateForm
    )
  };
}

function updateExpandOnView(updateForm: Function) {
  updateForm({
    name: "expandOnView",
    rawValue: false
  });
}

export function toggleExpanded(updateForm: Function) {
  return (b: boolean, events: Array<ConservationSubTypes>) => () => {
    updateExpandOnView(updateForm);
    updateForm({
      name: "events",
      rawValue: events.map(e => ({ ...e, expanded: b }))
    });
  };
}

export function toggleObjectsExpanded(updateForm: Function) {
  return (b: boolean) => () =>
    updateForm({
      name: "objectsExpanded",
      rawValue: b
    });
}

export function toggleSingleExpanded(updateForm: Function) {
  return (
    b: boolean,
    events: Array<ConservationSubTypes>,
    index: number,
    viewMode: boolean
  ) => () => {
    updateExpandOnView(updateForm);

    viewMode
      ? updateForm({
          name: "events",
          rawValue: events
            .slice(0, index)
            .concat([{ ...events[index], expanded: b }])
            .concat(events.slice(index + 1))
        })
      : emitError({
          type: "deleteError",
          message: I18n.t("musit.conservation.notAbleToCollapse")
        });
  };
}

function updateStringField(updateForm: Function) {
  return (name: string) => (evt: DomEvent) =>
    updateForm({
      name,
      rawValue: evt.target.value
    });
}

function updateSingleObjectField(updateForm: Function) {
  return (name: string) => (value: string) =>
    updateForm({
      name,
      rawValue: value
    });
}

function updateBooleanField(updateForm: Function) {
  return (name: string, b: boolean) => () =>
    updateForm({
      name,
      rawValue: b
    });
}

function updateArrayField(updateForm: Function) {
  return (name: string) => (evt: DomEvent) =>
    updateForm({
      name,
      rawValue: evt.target.value.split(",").map(v => v.trim())
    });
}

function updateMultiSelectField(updateForm: Function) {
  return (name: string) => (value: string) => {
    updateForm({
      name,
      rawValue: value
    });
    updateForm({
      name: "singleObjectSelected",
      rawValue: null
    });
    return updateForm({
      name: "editable",
      rawValue: value ? "-2" : null
    });
  };
}

export function updateConservationSubEvent(updateForm: Function) {
  return (
    name: string,
    events: Array<ConservationSubTypes>,
    arrayIndex: number
  ) => (fieldName: string) => (value: string) => {
    updateForm({
      name,
      rawValue: [
        ...events.slice(0, arrayIndex),
        { ...events[arrayIndex], [fieldName]: value },
        ...events.slice(arrayIndex + 1)
      ]
    });
  };
}

function updatePersonsForSubEvent(updateForm: Function) {
  return (
    name: string,
    events: Array<ConservationSubTypes>,
    arrayIndex: number
  ) => (v: { name: string, rawValue: Array<Person> }) => {
    updateForm({
      name,
      rawValue: [
        ...events.slice(0, arrayIndex),
        { ...events[arrayIndex], [v.name]: v.rawValue },
        ...events.slice(arrayIndex + 1)
      ]
    });
  };
}

const sortSubEventsOnly = events => {
  if (events && events.length > 1) {
    return sortBy(events, (o: any) => o.id);
  } else {
    return events;
  }
};

function onDocumentUpload(
  form: any,
  appSession: AppSession,
  location: Location<Array<ObjectData>>,
  updateForm?: ?Function,
  history: any
) {
  return (eventId: number, files: any) => {
    const files$ =
      files.length > 0
        ? // $FlowFixMe
          Observable.forkJoin(
            files.map(file =>
              uploadFile({
                eventId: eventId,
                museumId: appSession.museumId,
                collectionId: appSession.collectionId,
                token: appSession.accessToken,
                file: file
              })
            )
          )
        : Observable.of([]);
    return files$.toPromise().then((r: any) => {
      if (r.length > 0) {
        const formEvents: any = getFormEvents(form);
        const fids: ?Array<string> = getFids(r);
        const formEventsWithFiles = sortSubEventsOnly(
          formEvents.map(
            e =>
              e.id === eventId
                ? {
                    ...e,
                    files: e.files ? e.files.concat(r) : r,
                    documents: e.documents ? e.documents.concat(fids) : fids
                  }
                : e
          )
        );
        updateForm &&
          updateForm({
            name: "events",
            rawValue: formEventsWithFiles
          });
      }
    });
  };
}

async function addNewSubEvent(
  form: any,
  appSession: AppSession,
  location: Location<Array<ObjectData>>,
  newSubEventsToCreate?: ?any,
  updateForm?: ?Function
) {
  const formData = getConservationCollection(form, location);
  let newSubEvents = newSubEventsToCreate || [];
 
  const measurementevent = JSON.parse(await getCurrentMeasurementDataForObject(newSubEvents[0].affectedThings,  appSession.museumId,
    appSession.accessToken));

    newSubEvents =({
      ...newSubEvents[0],measurementData:measurementevent
    }) 
  
  const events =
  formData && formData.events && formData.events.length > 0
    ? formData.events
        .map(e => ({ ...e, isUpdated: false }))
        .concat(newSubEvents)
    : newSubEvents;
const data = events ? { ...formData, events, isUpdated: false } : formData;
  return saveConservation$.next({
    id: form.id.value,
    appSession,
    data,
    ajaxPost: simplePost,
    ajaxPut: simplePut,
    callback: {
      onComplete: props => {
        // do nothing is there is no props
        if (!props) {
          return;
        }

        if (updateForm) {
          // old Form events
          const formEvents =
            form &&
            form.events &&
            form.events.rawValue &&
            form.events.rawValue.length > 0
              ? form.events.rawValue
              : [];

          // All events from response
          const respEvents =
            props.response &&
            props.response.events &&
            props.response.events.length > 0
              ? props.response.events
              : [];

          // default person information for new event
          const defaultActorsAndRoles = [
            {
              name: appSession && appSession.actor && appSession.actor.fn,
              uuid:
                appSession && appSession.actor && appSession.actor.dataportenId,
              role: 1,
              date: formatISOString(new Date())
            }
          ];

          // new sub event with default attributes
          const newSubEventWithDefaultAttributes = re => ({
            ...re,
            actorsAndRoles: defaultActorsAndRoles,
            expanded: true
          });

          // return the from event if reponse has similar event
          const foundOldEventId = (re, formEvents) =>
            formEvents.find(fe => fe.id === re.id);

          // get the new sub events from the response
          const newSubEvents = respEvents.filter(
            re => !foundOldEventId(re, formEvents)
          );
          // newAllEvents = old From event + only new reponse event
          const newAllEvents = sortSubEventsOnly(
            formEvents.concat(
              newSubEvents.map(e => newSubEventWithDefaultAttributes(e))
            )
          );

          // update event with sorted events
          updateForm({
            name: "events",
            rawValue: newAllEvents
          });

          // clear the lookup list for sub events
          updateForm({
            name: "subEventTypes",
            rawValue: null
          });

          //New sub event in editable mode
          if (newSubEvents && newAllEvents && newSubEvents.length > 0) {
            updateForm({
              name: "editable",
              rawValue: (newAllEvents.length - 1).toString()
            });

            // new sub event has isUpdated true so that next save it will go to put
            setIsUpdated(updateForm, newAllEvents, newAllEvents.length - 1);
          }
        }
      },
      onFailure: err => {
        emitError(err);
      }
    }
  });
}

function onClickBack(props: any) {
  return (evt: DomEvent) => {
    evt.preventDefault();
    props.history.goBack();
  };
}

type OnUnmountProps = {
  clearForm: Function,
  clearStore: Function
};

export const onUnmount = (props: OnUnmountProps) => {
  props.clearStore();
  props.clearForm();
};

function saveEditableValues(updateForm: Function, form: any, i: number) {
  const rawValue =
    i && i === -1
      ? {
          caseNumber: form.caseNumber.rawValue || "",
          note: form.note.rawValue || "",
          actorsAndRoles: form.actorsAndRoles.rawValue || []
        }
      : form.events.rawValue || [];
  updateForm({
    name: "editableValues",
    rawValue: rawValue
  });
}

function setIsUpdated(updateForm: Function, events: any, index?: number) {
  if (events && events.length > 0) {
    const eventsWithAttributes = events.map((e, i) => ({
      ...e,
      isUpdated: i === index
    }));

    console.log(
      "Events.isUpdated = ",
      eventsWithAttributes.map(e => e.isUpdated)
    );

    updateForm({
      name: "events",
      rawValue: eventsWithAttributes
    });
  }

  updateForm({
    name: "isUpdated",
    rawValue: false
  });
}

function onEdit(updateForm: Function) {
  return (form: any, arrayIndex: number) => (evt: DomEvent) => {
    evt.preventDefault();
    saveEditableValues(updateForm, form, arrayIndex);
    updateForm({
      name: "editable",
      rawValue: arrayIndex.toString()
    });

    // add isUpdated true for main event or sub-event
    if (arrayIndex === -1) {
      setIsUpdated(updateForm, form.events.rawValue);
      updateForm({
        name: "isUpdated",
        rawValue: true
      });
    } else {
      setIsUpdated(updateForm, form.events.rawValue, arrayIndex);
    }
  };
}

function updateEditModeFields(updateForm: Function, form: FormData) {
  updateForm({
    name: "editableValues",
    rawValue: ""
  });
  updateForm({
    name: "editable",
    rawValue: ""
  });
  // setIsUpdated(updateForm, form.events.rawValue);
}

function applyEditableValues(
  updateForm: Function,
  editableValues: EditableValuesForm,
  i: number,
  events: Array<ConservationSubTypes>
) {
  const rawValue =
    editableValues && editableValues.rawValue
      ? editableValues.rawValue
      : events;
  if (i && i === -1) {
    updateForm({
      name: "caseNumber",
      rawValue: rawValue && rawValue.caseNumber ? rawValue.caseNumber : ""
    });
    updateForm({
      name: "note",
      rawValue: rawValue && rawValue.note ? rawValue.note : ""
    });
    updateForm({
      name: "actorsAndRoles",
      rawValue:
        rawValue && rawValue.actorsAndRoles ? rawValue.actorsAndRoles : []
    });
  } else {
    updateForm({
      name: "events",
      rawValue: rawValue
    });
  }
}

function onCancel(updateForm) {
  return (form: any, arrayIndex: number) => (evt: DomEvent) => {
    evt.preventDefault();
    applyEditableValues(
      updateForm,
      form.editableValues,
      arrayIndex,
      form.events.rawValue
    );
    updateEditModeFields(updateForm, form);
  };
}

function deleteSubEvents(
  updateForm: Function,
  events: Array<ConservationSubTypes>,
  i: number
) {
  updateForm({
    name: "events",
    rawValue: [...events.slice(0, i), ...events.slice(i + 1)]
  });
}

export function onDelete(updateForm: Function, appSession: AppSession) {
  return (
    id: number,
    events: Array<ConservationSubTypes>,
    arrayIndex: number
  ) => (evt: DomEvent) => {
    evt.preventDefault();
    const message = I18n.t("musit.conservation.askForDeleteConfirmation");
    showConfirm(message, () => {
      deleteConservation$.next({
        id: id,
        museumId: appSession.museumId,
        token: appSession.accessToken,
        callback: {
          onComplete: () => {
            deleteSubEvents(updateForm, events, arrayIndex);
            emitSuccess({
              type: "deleteSuccess",
              message: I18n.t("musit.conservation.confirmDelete")
            });
          },
          onFailure: e => {
            if (e.status === 403) {
              emitError({
                type: "deleteError",
                message: I18n.t("musit.errorMainMessages.notAllowed")
              });
            } else {
              emitError({
                type: "deleteError",
                message: e.message
              });
            }
          }
        }
      });
    });
  };
}

function onSave(
  form: any,
  appSession: AppSession,
  history,
  location,
  ajaxPost,
  ajaxPut,
  updateForm
) {
  return (evt: DomEvent) => {
    evt.preventDefault();
    const id = form.id.value;
    const data = getConservationCollection(form, location);
    saveConservation$.next({
      id: id,
      appSession,
      data: id ? data : { ...data, isUpdated: true }, // on add of main event isUpdated is true
      ajaxPost,
      ajaxPut,
      callback: {
        onComplete: props => {
          if (!props) {
            return;
          }
          //variable to get hold of which event is to be updated
          const localUpdatedIndexValue =
            form.id.value && form.editable.rawValue;

          const id = props.response.id;
          updateEditModeFields(updateForm, form);

          // show the updated date when response have it
          props.response.updatedDate &&
            updateForm({
              name: "updatedDate",
              rawValue: props.response.updatedDate
            });

          // on edit show the logged in user as last updated by
          if (
            form.id.value &&
            appSession &&
            appSession.actor &&
            appSession.actor.fn
          ) {
            updateForm({
              name: "updatedByName",
              rawValue: appSession.actor.fn
            });
          }
          /** check if it's cp to be udated, then do nothing. If it's a measurementDetermination and 
           * the user removes value from the field quantity, we also remove the value(if it exists) from quantitySymbol before 
           * saving/summit. We check if the attribute quantitySymbol has value in form.event.rawvalue but has no value from prop.response.
           * If so, we set quantitySymbol to "" in form.event.rawValue. We do this to show right value in quantitySymbol without having
           * to refresh the whole form.
           */
          if (localUpdatedIndexValue && localUpdatedIndexValue >= 0) {
            if (form.events && form.events.rawValue) {
              if (form.events.rawValue.length > 0) {
                const formEventsRawValue = form.events.rawValue;
                const updatedEventId =
                  formEventsRawValue[localUpdatedIndexValue].id;
                const eventFromDb = props.response.events.find(
                  event =>
                    event.id === updatedEventId &&
                    event.eventTypeId === measurementDeterminationTypeId
                );
                if (eventFromDb) {
                  const quantitySymbol =
                    eventFromDb.measurementData.quantitySymbol;
                  if (
                    eventFromDb.measurementData.quantitySymbol === "" &&
                    formEventsRawValue[localUpdatedIndexValue].measurementData
                      .quantitySymbol !== ""
                  ) {
                    const measurementData = {
                      ...formEventsRawValue[localUpdatedIndexValue]
                        .measurementData,
                      quantitySymbol
                    };
                    const newEventToUpdate = {
                      ...formEventsRawValue[localUpdatedIndexValue],
                      measurementData
                    };
                    updateForm({
                      name: "events",
                      rawValue: [
                        ...formEventsRawValue.slice(0, localUpdatedIndexValue),
                        newEventToUpdate,
                        ...formEventsRawValue.slice(localUpdatedIndexValue + 1)
                      ]
                    });
                  }
                }
              }
            }
          }

          // incase of Add change the URL
          if (!form.id.value) {
            history.replace(
              Config.magasin.urls.client.conservation.viewConservation(
                appSession,
                parseInt(id, 10)
              )
            );
          }
        },
        onFailure: err => {
          emitError(err);
        }
      }
    });
  };
}
