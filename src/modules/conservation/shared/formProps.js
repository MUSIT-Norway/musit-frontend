// @flow
import { getObjects, getConservationCollection } from '../shared/submit';
import { saveConservation$, uploadFile$ } from '../conservationStore';
import type { Location } from '../shared/submit';
import { simplePost, simplePut } from '../../../shared/RxAjax';
import type { History } from '../../../types/Routes';
import type { AppSession } from '../../../types/appSession';

import type { FormData } from '../shared/formType';
import type { PredefinedConservation } from '../../../types/predefinedConservation';
import type { Person } from '../../../types/person';
import type {
  ConservationStoreState as Store,
  ConservationSubTypes
} from '../../../types/conservation';
import type { DomEvent } from '../../../types/dom';
import toArray from 'lodash/toArray';
import type { ObjectData } from '../../../types/object';
import { isFormValid } from '../../../forms/validators';
import { emitError } from '../../../shared/errors';
import Config from '../../../config';
import { uploadFile } from '../../../models/conservation/documents';
import { sortBy } from 'lodash';

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
    toggleSingleExpanded: toggleSingleExpanded(props.updateForm),
    clickSaveAndContinue: clickSaveAndContinue,
    clickSave: clickSave(
      props.form,
      props.appSession,
      props.history,
      props.location,
      ajaxPost,
      ajaxPut
    ),
    clickCancel: clickCancel(props),
    onDocumentUpload: onDocumentUpload(
      props.form,
      props.appSession,
      props.location,
      props.history
    )
  };
}

export function toggleExpanded(updateForm: any) {
  return (b: boolean, events: Array<ConservationSubTypes>) => () =>
    updateForm({
      name: 'events',
      rawValue: events.map(e => ({ ...e, expanded: b }))
    });
}

export function toggleSingleExpanded(updateForm: any) {
  return (b: boolean, events: Array<ConservationSubTypes>, index: number) => () =>
    updateForm({
      name: 'events',
      rawValue: events
        .slice(0, index)
        .concat([{ ...events[index], expanded: b }])
        .concat(events.slice(index + 1))
    });
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
  return (name: string) => (value: string) =>
    updateForm({
      name,
      rawValue: value
    });
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

function onDocumentUpload(
  form: any,
  appSession: AppSession,
  location: Location<Array<ObjectData>>,
  history: any
) {
  return (eventId: number, files: any) => {
    return uploadFile$.next({
      eventId,
      parentEventId: form.id.value,
      museumId: appSession.museumId,
      collectionId: appSession.collectionId,
      token: appSession.accessToken,
      files: files,
      data: getConservationCollection(form, location),
      callback: {
        onComplete: props => {
          if (!props) {
            return;
          }
          history.replace(
            Config.magasin.urls.client.conservation.viewConservation(
              appSession,
              parseInt(form.id.value, 10)
            )
          );
        },
        onFailure: err => {
          emitError(err);
        }
      }
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

function clickSaveAndContinue(
  form: any,
  appSession: AppSession,
  location: Location<Array<ObjectData>>,
  newSubEventsToCreate?: ?any,
  updateForm?: ?Function,
  updateFormDataEvenName?: ?any
) {
  const formData = getConservationCollection(form, location);
  const newSubEvents = newSubEventsToCreate || [];
  const events =
    formData && formData.events && formData.events.length > 0
      ? formData.events.concat(newSubEvents)
      : newSubEvents;
  const data = events ? { ...formData, events: events } : formData;

  return saveConservation$.next({
    id: form.id.value,
    appSession,
    data: data,
    ajaxPost: simplePost,
    ajaxPut: simplePut,
    callback: {
      onComplete: props => {
        if (!props) {
          return;
        }
        if (updateForm && updateFormDataEvenName) {
          if (!form.id.value) {
            updateForm({
              name: 'id',
              rawValue: props.response.id
            });
          }

          // add form events + new events
          const formEvents =
            form &&
            form.events &&
            form.events &&
            form.events.rawValue &&
            form.events.rawValue.length > 0
              ? form.events.rawValue
              : [];
          const respEvents =
            props.response && props.response.events && props.response.events.length > 0
              ? props.response.events
              : [];
          const updateEvents =
            newSubEventsToCreate && newSubEventsToCreate.length > 0 ? true : false;

          const foundOldEventId = (re, formEvents) =>
            formEvents.find(fe => fe.id === re.id);
          const newEvents = formEvents
            ? respEvents.map(
                re =>
                  foundOldEventId(re, formEvents) ? foundOldEventId(re, formEvents) : re
              )
            : respEvents;

          updateEvents &&
            updateForm({
              name: updateFormDataEvenName,
              rawValue: sortSubEventsOnly(newEvents)
            });

          updateForm({
            name: 'subEventTypes',
            rawValue: null
          });
        }
      },
      onFailure: err => {
        emitError(err);
      }
    }
  });
}

function clickSave(form, appSession, history, location, ajaxPost, ajaxPut) {
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
          history.replace(
            Config.magasin.urls.client.conservation.viewConservation(
              appSession,
              parseInt(id, 10)
            )
          );
        },
        onFailure: err => {
          emitError(err);
        }
      }
    });
  };
}

function clickCancel(props: any) {
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
