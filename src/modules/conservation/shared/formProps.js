// @flow
import { getObjects, getConservationCollection } from '../shared/submit';
import {
  saveConservation$,
  uploadFile$,
  deleteConservation$
} from '../conservationStore';
import type { Location } from '../shared/submit';
import { simplePost, simplePut } from '../../../shared/RxAjax';
import type { History } from '../../../types/Routes';
import type { AppSession } from '../../../types/appSession';

import type { PredefinedConservation } from '../../../types/predefinedConservation';
import type { Person } from '../../../types/person';
import type {
  ConservationStoreState as Store,
  ConservationSubTypes,
  EditableValuesForm,
  FormData
} from '../../../types/conservation';
import type { DomEvent } from '../../../types/dom';
import toArray from 'lodash/toArray';
import type { ObjectData } from '../../../types/object';
import { isFormValid } from '../../../forms/validators';
import { emitError, emitSuccess } from '../../../shared/errors';
import Config from '../../../config';
import { sortBy } from 'lodash';
import { Observable } from 'rxjs';
import { getFormEvents, getFids } from './utils';
import { uploadFile } from '../../../models/conservation/documents';
import { showConfirm } from '../../../shared/modal';
import { formatISOString } from '../../../shared/util';

import { I18n } from 'react-i18nify';

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
    objects: getObjects(toArray(props.form.affectedThings.value), props.location),
    updateStringField: updateStringField(props.updateForm),
    updateBooleanField: updateBooleanField(props.updateForm),
    updateArrayField: updateArrayField(props.updateForm),
    updateMultiSelectField: updateMultiSelectField(props.updateForm),
    updateConservationSubEvent: updateConservationSubEvent(props.updateForm),
    updatePersonsForSubEvent: updatePersonsForSubEvent(props.updateForm),
    toggleExpanded: toggleExpanded(props.updateForm),
    toggleObjectsExpanded: toggleObjectsExpanded(props.updateForm),
    toggleSingleExpanded: toggleSingleExpanded(props.updateForm),
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

function updateExpandOnView(updateForm: any) {
  updateForm({
    name: 'expandOnView',
    rawValue: false
  });
}

export function toggleExpanded(updateForm: any) {
  return (b: boolean, events: Array<ConservationSubTypes>) => () => {
    updateExpandOnView(updateForm);
    updateForm({
      name: 'events',
      rawValue: events.map(e => ({ ...e, expanded: b }))
    });
  };
}

export function toggleObjectsExpanded(updateForm: any) {
  return (b: boolean) => () =>
    updateForm({
      name: 'objectsExpanded',
      rawValue: b
    });
}

export function toggleSingleExpanded(updateForm: any) {
  return (
    b: boolean,
    events: Array<ConservationSubTypes>,
    index: number,
    viewMode: boolean
  ) => () => {
    updateExpandOnView(updateForm);

    viewMode
      ? updateForm({
          name: 'events',
          rawValue: events
            .slice(0, index)
            .concat([{ ...events[index], expanded: b }])
            .concat(events.slice(index + 1))
        })
      : emitError({
          type: 'deleteError',
          message: I18n.t('musit.conservation.notAbleToCollapse')
        });
  };
}

function updateStringField(updateForm: any) {
  return (name: string) => (evt: DomEvent) =>
    updateForm({
      name,
      rawValue: evt.target.value
    });
}

function updateBooleanField(updateForm: any) {
  return (name: string, b: boolean) => () =>
    updateForm({
      name,
      rawValue: b
    });
}

function updateArrayField(updateForm: any) {
  return (name: string) => (evt: DomEvent) =>
    updateForm({
      name,
      rawValue: evt.target.value.split(',').map(v => v.trim())
    });
}

function updateMultiSelectField(updateForm: any) {
  return (name: string) => (value: string) => {
    updateForm({
      name,
      rawValue: value
    });
    return updateForm({
      name: 'editable',
      rawValue: value ? '-2' : null
    });
  };
}

export function updateConservationSubEvent(updateForm: any) {
  return (name: string, events: Array<ConservationSubTypes>, arrayIndex: number) => (
    fieldName: string
  ) => (value: string) => {
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

function updatePersonsForSubEvent(updateForm: any) {
  return (name: string, events: Array<ConservationSubTypes>, arrayIndex: number) => (v: {
    name: string,
    rawValue: Array<Person>
  }) => {
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
            name: 'events',
            rawValue: formEventsWithFiles
          });
      }
    });
  };
}

function addNewSubEvent(
  form: any,
  appSession: AppSession,
  location: Location<Array<ObjectData>>,
  newSubEventsToCreate?: ?any,
  updateForm?: ?Function
) {
  const formData = getConservationCollection(form, location);
  const newSubEvents = newSubEventsToCreate || [];
  const events =
    formData && formData.events && formData.events.length > 0
      ? formData.events.concat(newSubEvents)
      : newSubEvents;
  const data = events ? { ...formData, events: events, updatedEventdId: null } : formData;

  return saveConservation$.next({
    id: form.id.value,
    appSession,
    data: data,
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
            form && form.events && form.events.rawValue && form.events.rawValue.length > 0
              ? form.events.rawValue
              : [];

          // All events from response
          const respEvents =
            props.response && props.response.events && props.response.events.length > 0
              ? props.response.events
              : [];

          // default person information for new event
          const defaultActorsAndRoles = [
            {
              name: appSession && appSession.actor && appSession.actor.fn,
              uuid: appSession && appSession.actor && appSession.actor.dataportenId,
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
          const newSubEvents = respEvents.filter(re => !foundOldEventId(re, formEvents));

          // newAllEvents = old From event + only new reponse event
          const newAllEvents = sortSubEventsOnly(
            formEvents.concat(newSubEvents.map(e => newSubEventWithDefaultAttributes(e)))
          );

          // update evetns with sorted events
          updateForm({
            name: 'events',
            rawValue: newAllEvents
          });

          // clear the lookup list for sub events
          updateForm({
            name: 'subEventTypes',
            rawValue: null
          });

          //New sub event in editable mode
          if (newSubEvents && newAllEvents && newSubEvents.length > 0) {
            updateForm({
              name: 'editable',
              rawValue: (newAllEvents.length - 1).toString()
            });

            // new sub event id is added in updatedEventdId so that next save it will go to put
            updateForm({
              name: 'updatedEventdId',
              rawValue: newSubEvents[0].id.toString()
            });
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

function saveEditableValues(updateForm: any, form: any, i: number) {
  const rawValue =
    i && i === -1
      ? {
          caseNumber: form.caseNumber.rawValue || '',
          note: form.note.rawValue || '',
          actorsAndRoles: form.actorsAndRoles.rawValue || []
        }
      : form.events.rawValue || [];
  updateForm({
    name: 'editableValues',
    rawValue: rawValue
  });
}

function onEdit(updateForm: any) {
  return (form: any, arrayIndex: number) => (evt: DomEvent) => {
    evt.preventDefault();
    saveEditableValues(updateForm, form, arrayIndex);
    updateForm({
      name: 'editable',
      rawValue: arrayIndex.toString()
    });
    const updatedEventId = arrayIndex.toString()
      ? arrayIndex === -1
        ? form.id.rawValue.toString()
        : form.events.rawValue[arrayIndex].id.toString()
      : '';
    updateForm({
      name: 'updatedEventdId',
      rawValue: updatedEventId
    });
  };
}

function updateEditModeFields(updateForm: any) {
  updateForm({
    name: 'editableValues',
    rawValue: ''
  });
  updateForm({
    name: 'editable',
    rawValue: ''
  });
  updateForm({
    name: 'updatedEventdId',
    rawValue: ''
  });
}

function applyEditableValues(
  updateForm: any,
  editableValues: EditableValuesForm,
  i: number,
  events: Array<ConservationSubTypes>
) {
  const rawValue =
    editableValues && editableValues.rawValue ? editableValues.rawValue : null;
  if (i && i === -1) {
    updateForm({
      name: 'caseNumber',
      rawValue: rawValue && rawValue.caseNumber ? rawValue.caseNumber : ''
    });
    updateForm({
      name: 'note',
      rawValue: rawValue && rawValue.note ? rawValue.note : ''
    });
    updateForm({
      name: 'actorsAndRoles',
      rawValue: rawValue && rawValue.actorsAndRoles ? rawValue.actorsAndRoles : []
    });
  } else {
    updateForm({
      name: 'events',
      rawValue: rawValue || events
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
    updateEditModeFields(updateForm);
  };
}

function deleteSubEvents(
  updateForm: any,
  events: Array<ConservationSubTypes>,
  i: number
) {
  updateForm({
    name: 'events',
    rawValue: [...events.slice(0, i), ...events.slice(i + 1)]
  });
}

export function onDelete(updateForm: any, appSession: AppSession) {
  return (id: number, events: Array<ConservationSubTypes>, arrayIndex: number) => (
    evt: DomEvent
  ) => {
    evt.preventDefault();
    const message = I18n.t('musit.conservation.askForDeleteConfirmation');
    showConfirm(message, () => {
      deleteConservation$.next({
        id: id,
        museumId: appSession.museumId,
        token: appSession.accessToken,
        callback: {
          onComplete: () => {
            deleteSubEvents(updateForm, events, arrayIndex);
            emitSuccess({
              type: 'deleteSuccess',
              message: I18n.t('musit.conservation.confirmDelete')
            });
          },
          onFailure: e => {
            if (e.status === 403) {
              emitError({
                type: 'deleteError',
                message: I18n.t('musit.errorMainMessages.notAllowed')
              });
            } else {
              emitError({
                type: 'deleteError',
                message: e.message
              });
            }
          }
        }
      });
    });
  };
}

function onSave(form, appSession, history, location, ajaxPost, ajaxPut, updateForm) {
  return (evt: DomEvent) => {
    evt.preventDefault();
    saveConservation$.next({
      id: form.id.value,
      appSession,
      data: getConservationCollection(form, location),
      ajaxPost,
      ajaxPut,
      callback: {
        onComplete: props => {
          if (!props) {
            return;
          }
          const id = props.response.id;
          updateEditModeFields(updateForm);

          // show the updated date when response have it
          props.response.updatedDate &&
            updateForm({
              name: 'updatedDate',
              rawValue: props.response.updatedDate
            });

          // on edit show the logged in user as last updated by
          if (form.id.value && appSession && appSession.actor && appSession.actor.fn) {
            updateForm({
              name: 'updatedByName',
              rawValue: appSession.actor.fn
            });
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
